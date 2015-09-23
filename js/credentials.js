'use strict';

var $ = require('jquery');

var Analytics = require('./analytics');
var CredentialStorage = require('./credential_storage');
var Storage = require('./storage');
var Translator = require('./translator');

module.exports = function() {
    var container = $('.credentials');
    var password_stars_class = 'password-stars';
    var password_real_class = 'password-real';

    var storage_key = 'temporary-credentials';

    function display_credentials(credentials) {
        container.children().remove();

        for (var key in credentials) {
            if (credentials.hasOwnProperty(key)) {
                var c = credentials[key];
                var elem = $(
                    '<tr>' +
                        '<td class="url">' + c.url + '</td>' +
                        '<td class="username">' + c.username + '</td>' +
                        '<td class="password">' +
                            '<span class="' + password_stars_class + '">***</span>' +
                            '<span class="' + password_real_class + '">' + c.password + '</span>' +
                            '<button class="show-password">' + Translator.translate("show_hide_password") + '</button>' +
                        '</td>' +
                        '<td class="action">' +
                            '<button class="remove" data-url="' + c.url + '">' + Translator.translate("remove_credential") + '</button>' + '' +
                            '<button class="edit" data-url="' + c.url + '">' + Translator.translate("edit_credential") + '</button>' + '' +
                        '</td>' +
                    '</tr>'
                );

                container.prepend(elem);
            }
        }
    }

    function togglePassword(e) {
        var password = $(e.currentTarget).parent();
        password.find('.' + password_stars_class).toggle();
        password.find('.' + password_real_class).toggle();

        Analytics.event('Credentials', 'password visibility toggled');
    }

    function submit(e) {
        e.preventDefault();

        var url = $('#url');
        var username = $('#username');
        var password = $('#password');

        var values = {
            url: url.val(),
            username: username.val(),
            password: password.val()
        };

        var valid = true;
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                var v = values[key];

                if(v === '') {
                    console.error('Error - ' + key + ' : ' + v + ' is empty !');
                    valid = false;
                }
            }
        }

        if(valid) {
            var old = $('tr.editing .url');
            if(old.length > 0 && old.text().length > 0) {
                CredentialStorage.removeCredential(old.text());
            }

            CredentialStorage.addCredential(values);

            url.val('');
            username.val('');
            password.val('');

            reset_form();

            Analytics.event('Credentials', 'added');
        } else {
            Analytics.event('Credentials', 'error in form');

        }
    }

    function remove(e) {
        var url = $(e.currentTarget).data('url');
        CredentialStorage.removeCredential(url);

        Analytics.event('Credentials', 'removed');
    }

    function edit(e) {
        var url = $('#url');
        var username = $('#username');
        var password = $('#password');

        var tr = $(e.currentTarget).parents('tr');

        tr.addClass('editing');

        url.val(tr.find('.url').text());
        username.val(tr.find('.username').text());
        password.val(tr.find('.' + password_real_class).text());

        $('.credential-form-submit').text(Translator.translate('edit_credential'));
    }

    function reset_form() {
        $('tr.editing').removeClass('editing');
        $('.credential-form-submit').text(Translator.translate('add_credential'));
    }

    function init() {
        CredentialStorage.register(display_credentials);

        $(document).on('submit', '#credential-form', submit);
        $(document).on('click', '.credential-form-reset', reset_form);
        $(document).on('click', '.remove', remove);
        $(document).on('click', '.edit', edit);
        $(document).on('click', '.show-password', togglePassword);

        Storage.get(storage_key, function(result) {
            $('#url').val(result.url || '');
            $('#username').val(result.username || '');
            $('#password').val(result.password || '');

            Storage.set(storage_key, {});
        });

        addEventListener('unload', function () {
            var url = $('#url').val();
            var username = $('#username').val();
            var password = $('#password').val();

            var values = {
                url: url,
                username: username,
                password: password
            };
            chrome.extension.getBackgroundPage().Storage.set.apply(this, [storage_key, values]);
        });
    }

    return {
        'init': init
    };
}();
