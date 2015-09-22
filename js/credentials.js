var Credentials = function() {
    'use strict';

    var container = $('.credentials');
    var password_stars_class = 'password-stars';
    var password_real_class = 'password-real';


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

    function togglePassword() {
        var password = $(this).parent();
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
            var old = url.data('old-url');
            if(typeof(old) != 'undefined' && old.length > 0) {
                CredentialStorage.removeCredential(old);
                url.data('old-url', '');
                url.parents('tr').removeClass('editing');
                $('.credential-form-submit').text(Translator.translate("add_credential"));
            }

            CredentialStorage.addCredential(values);

            url.val('');
            username.val('');
            password.val('');

            Analytics.event('Credentials', 'added');
        } else {
            Analytics.event('Credentials', 'error in form');

        }
    }

    function remove() {
        var url = $(this).data('url');
        CredentialStorage.removeCredential(url);

        Analytics.event('Credentials', 'removed');
    }

    function edit() {
        var url = $('#url');
        var username = $('#username');
        var password = $('#password');

        var tr = $(this).parents('tr');

        tr.addClass('editing');

        url.val(tr.find('.url').text());
        url.data('old-url', $(this).data('url'));
        username.val(tr.find('.username').text());
        password.val(tr.find('.' + password_real_class).text());

        $('.credential-form-submit').text(Translator.translate("edit_credential"));
    }

    function init() {
        CredentialStorage.register(display_credentials);

        $('#credential-form').on('submit', submit);
        $(document).on('click', '.remove', remove);
        $(document).on('click', '.edit', edit);
        $(document).on('click', '.show-password', togglePassword);
    }

    return {
        'init': init
    }
}();

$(function () {
    Credentials.init();
});
