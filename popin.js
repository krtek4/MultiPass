var credentials = [];

function display_credentials(credentials) {
    $('.current-credential').remove();

    for (var key in credentials) {
        if (credentials.hasOwnProperty(key)) {
            var c = credentials[key];
            var elem = $(
                    '<tr class="current-credential">' +
                    '<td>' + key + '</td>' +
                    '<td>' + c.url + '</td>' +
                    '<td>' + c.username + '</td>' +
                    '<td>***</td>' +
                    '<td><button class="remove" data-id="' + key + '">Remove</button></td>' +
                    '</tr>'
            );

            $('.credentials').prepend(elem);
        }
    }
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === 'sync' && changes.hasOwnProperty('credentials')) {
        credentials = changes.credentials.newValue;
        display_credentials(credentials);
    }
});

function add_credential(url, username, password) {
    var credential = {
        url: url,
        username: username,
        password: password
    };
    credentials.push(credential);
    chrome.storage.sync.set({credentials: credentials});
}

function remove_credential(index) {
    var credential = credentials.splice(index, 1);
    chrome.storage.sync.set({credentials: credentials});
}

$(function () {
    $('#add').on('click', function () {
        var url = $('#url').val();
        var username = $('#username').val();
        var password = $('#password').val();

        add_credential(url, username, password);
    });

    $(document).on('click', '.remove', function () {
        var id = $(this).data('id');
        remove_credential(id);
    });

    chrome.storage.sync.get('credentials', function (result) {
        if (result.hasOwnProperty('credentials')) {
            credentials = result.credentials;
        }

        display_credentials(credentials);
    });
});
