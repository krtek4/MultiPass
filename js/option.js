var Option = function() {
    'use strict';

    var credentials = [];
    var file_credentials = [];

    var import_output;
    var import_file_field;
    var import_json_field;

    function modal(title, content, confirmation) {
        var modal = $($('.overlay').clone());

        modal.removeAttr('style');
        modal.find('button, .close-button').on('click', function() {
            modal.addClass('transparent');
            setTimeout(function () {
                modal.remove();
            }, 1000);
        });

        modal.find('.modal-confirm').on('click', function() {
            confirmation();
        });

        modal.find('.modal-title').html(title);
        modal.find('.modal-content').html(content);

        modal.on('click', function () {
            modal.find('.page').addClass('pulse');
            modal.find('.page').on('webkitAnimationEnd', function() {
                $(this).removeClass('pulse');
            });
        });

        modal.find('.page').on('click', function(e) {
            e.stopPropagation();
        });

        $('body').append(modal);
    }

    function update_output_credentials() {
        var ul = $('<ul>');
        import_output.empty().append(ul);

        var display_credentials = credentials.concat(file_credentials);

        for (var key in display_credentials) {
            if (display_credentials.hasOwnProperty(key)) {
                var c = display_credentials[key];
                var li = $('<li>' + c.url + ' : ' + c.username + ' - ' + c.password + '</li>');
                ul.append(li);
            }
        }
    }

    function parse_json(text) {
        var result = [];

        try {
            var json = JSON.parse(text);

            for (var key in json) {
                if (json.hasOwnProperty(key)) {
                    var c = json[key];
                    result.push(c);
                }
            }
        } catch (err) {
            console.error('JSON is malformed : ||' + text + '||');
        }

        return result;
    }

    function import_file(e) {
        var files = e.target.files;

        for (var i = 0, file; file = files[i]; ++i) {
            var reader = new FileReader();
            reader.onloadend = function (event) {
                if (event.target.readyState == FileReader.DONE) {
                    file_credentials = file_credentials.concat(parse_json(event.target.result));
                    update_output_credentials();
                } else {
                    console.error('Error reading the file.');
                }
            };
            reader.readAsText(file);
        }
    }

    function import_json(e) {
        credentials = parse_json(import_json_field.val());
        update_output_credentials();
    }

    function import_credentials(e) {
        var import_credentials = credentials.concat(file_credentials);

        for (var key in import_credentials) {
            if (import_credentials.hasOwnProperty(key)) {
                Storage.addCredential(import_credentials[key]);
            }
        }

        credentials = [];
        file_credentials = [];
        import_output.empty();
        import_file_field.val('');
        import_json_field.val('');

        e.preventDefault();
    }

    function export_credentials(e) {
        var data = "text/json;charset=utf-8," + encodeURIComponent(Storage.asJSON());
        $(this).attr('href', 'data:' + data);
    }

    function clear_credentials(e) {
        modal(chrome.i18n.getMessage("clear_credentials_modal_title"), chrome.i18n.getMessage("clear_credentials_modal_text"), function () {
            Storage.clearAll();
        });
        e.preventDefault();
    }

    function init() {
        import_output = $('output.import-list');
        import_file_field = $('#import-file');
        import_json_field = $('#import-json');


        import_file_field.on('change', import_file);
        import_json_field.on('change', import_json);
        $('button.import-submit').on('click', import_credentials);

        $('a.export-credentials').on('click', export_credentials);

        $('button.clear-all').on('click', clear_credentials);
    }

    return {
        'init': init
    }
}();

$(function () {
    Analytics.event('Options', 'opened');
    Option.init();
});
