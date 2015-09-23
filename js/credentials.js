'use strict';

var $ = require('jquery');

var Analytics = require('./analytics');
var CredentialStorage = require('./credential_storage');
var Storage = require('./storage');
var Translator = require('./translator');

var React = require('react');
var Table = require('./components/table');

module.exports = function() {
    var storage_key = 'temporary-credentials';

    function display_credentials(credentials) {
        React.render(<Table credentials={credentials} />, $('.credential-table-container')[0]);
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
        e.preventDefault();

        var url = $(e.currentTarget).data('url');
        CredentialStorage.removeCredential(url);

        Analytics.event('Credentials', 'removed');
    }

    function edit(e) {
        e.preventDefault();

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
