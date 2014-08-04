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
                        '<th class="index">' + key + '</th>' +
                        '<td class="url">' + c.url + '</td>' +
                        '<td class="username">' + c.username + '</td>' +
                        '<td class="password">' +
                            '<span class="' + password_stars_class + '">***</span>' +
                            '<span class="' + password_real_class + '">' + c.password + '</span>' +
                            '<button class="show-password">Show / Hide</button>' +
                        '</td>' +
                        '<td class="action"><button class="remove" data-id="' + key + '">Remove</button></td>' +
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

        Analytics.event('ToggleCredentials', 'clicked');
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
                    console.log('Error - ' + key + ' : ' + v + ' is empty !');
                    valid = false;
                }
            }
        }

        if(valid) {
            Storage.addCredential(values);

            url.val('');
            username.val('');
            password.val('');

            Analytics.event('AddCredentials', 'clicked');
        } else {
            Analytics.event('ErrorInCredentials', 'clicked');

        }

        e.preventDefault();
    }

    function remove() {
        var id = $(this).data('id');
        Storage.removeCredential(id);

        Analytics.event('RemoveCredentials', 'clicked');
    }

    function init() {
        Storage.addListener(function(credentials) {
            display_credentials(credentials);
        });

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
