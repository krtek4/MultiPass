var Popin = function() {
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
    }

    function add(e) {
        var url = $('#url');
        var username = $('#username');
        var password = $('#password');

        Storage.addCredential(url.val(), username.val(), password.val());

        url.val('');
        username.val('');
        password.val('');

        e.preventDefault();
    }

    function remove() {
        var id = $(this).data('id');
        Storage.removeCredential(id);
    }

    function init() {
        Storage.addListener(function(credentials) {
            display_credentials(credentials);
        });

        $('#credential-form').on('submit', add);
        $(document).on('click', '.remove', remove);
        $(document).on('click', '.password > span', togglePassword);
    }

    return {
        'init': init
    }
}();

$(function () {
    Popin.init();
});
