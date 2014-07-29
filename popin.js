var Popin = function() {
    'use strict';

    var container = $('.credentials');
    var credential_class = 'credential';


    function display_credentials(credentials) {
        container.find('.');
        $('.' + credential_class).remove();

        for (var key in credentials) {
            if (credentials.hasOwnProperty(key)) {
                var c = credentials[key];
                var elem = $(
                        '<tr class="' + credential_class + '">' +
                        '<th class="index">' + key + '</th>' +
                        '<td class="url">' + c.url + '</td>' +
                        '<td class="username">' + c.username + '</td>' +
                        '<td class="password">***</td>' +
                        '<td class="action"><button class="remove" data-id="' + key + '">Remove</button></td>' +
                        '</tr>'
                );

                container.prepend(elem);
            }
        }
    }

    function add() {
        var url = $('#url');
        var username = $('#username');
        var password = $('#password');

        Storage.addCredential(url.val(), username.val(), password.val());

        url.val('');
        username.val('');
        password.val('');
    }

    function remove() {
        var id = $(this).data('id');
        Storage.removeCredential(id);
    }

    function init() {
        Storage.addListener(function(credentials) {
            display_credentials(credentials);
        });

        $('#add').on('click', add);
        $(document).on('click', '.remove', remove);
    }

    return {
        'init': init
    }
}();

$(function () {
    Popin.init();
});
