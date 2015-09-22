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
                        '<td class="action"><button class="remove" data-url="' + c.url + '">' + Translator.translate("remove_credential") + '</button></td>' +
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

    function add(e) {
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
            CredentialStorage.addCredential(values);

            url.val('');
            username.val('');
            password.val('');

            Analytics.event('Credentials', 'added');
        } else {
            Analytics.event('Credentials', 'error in form');

        }

        e.preventDefault();
    }

    function remove() {
        var url = $(this).data('url');
        CredentialStorage.removeCredential(url);

        Analytics.event('Credentials', 'removed');
    }

    function init() {
        CredentialStorage.register(display_credentials);

        $('#credential-form').on('submit', add);
        $(document).on('click', '.remove', remove);
        $(document).on('click', '.show-password', togglePassword);
    }

    return {
        'init': init
    }
}();

$(function () {
    Credentials.init();
});
