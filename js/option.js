'use strict';

var $ = require('jquery');

var Analytics = require('./analytics');
var Credentials = require('./credentials');
var CredentialStorage = require('./credential_storage');
var Translator = require('./translator');

var OptionPanel = function() {
    var credentials = [];
    var file_credentials = [];

    var import_output;
    var import_file_field;
    var import_json_field;

    function modal(title, content, confirmation) {
        var overlay = $($('.overlay').clone());

        overlay.removeAttr('style');
        overlay.find('button, .close-button').on('click', function() {
            overlay.addClass('transparent');
            setTimeout(function () {
                overlay.remove();
            }, 1000);
        });

        overlay.find('.modal-confirm').on('click', function() {
            confirmation();
        });

        overlay.find('.overlay-title').html(title);
        overlay.find('.overlay-content').html(content);

        overlay.on('click', function () {
            overlay.find('.page').addClass('pulse');
            overlay.find('.page').on('webkitAnimationEnd', function() {
                $(this).removeClass('pulse');
            });
        });

        overlay.find('.page').on('click', function(e) {
            e.stopPropagation();
        });

        $('body').append(overlay);
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
            Analytics.event('Importer', 'malformed JSON');
            console.error('JSON is malformed : ||' + text + '||');
        }

        return result;
    }

    function readerOnLoadEnd(event) {
        if (event.target.readyState == FileReader.DONE) {
            file_credentials = file_credentials.concat(parse_json(event.target.result));
            update_output_credentials();
        } else {
            console.error('Error reading the file.');
            Analytics.event('Importer', 'file error');
        }
    }

    function import_file(e) {
        Analytics.event('Importer', 'file added');

        var files = e.target.files;
        var len = files.length;

        for (var i = 0; i < len; ++i) {
            var reader = new FileReader();
            reader.onloadend = readerOnLoadEnd;
            reader.readAsText(files[i]);
        }
    }

    function import_json() {
        Analytics.event('Importer', 'JSON added');

        credentials = parse_json(import_json_field.val());
        update_output_credentials();
    }

    function import_credentials(e) {
        Analytics.event('Importer', 'imported');

        var new_credentials = credentials.concat(file_credentials);

        for (var key in new_credentials) {
            if (new_credentials.hasOwnProperty(key)) {
                CredentialStorage.addCredential(new_credentials[key]);
            }
        }

        credentials = [];
        file_credentials = [];
        import_output.empty();
        import_file_field.val('');
        import_json_field.val('');

        e.preventDefault();
    }

    function restore_test_input() {
        if($('#test-urls li').length == 0) {
            $('#test-urls').append($('<li>http://www.example.com</li>'));
        }
    }

    function test_regex() {
        var regex = $('#test-regex').val();

        $('#test-urls li').each(function(index, el) {
            var re = new RegExp(regex);
            var url = $(el).text().trim();

            $(el).toggleClass('matched', re.test(url) && url.length > 0);
        });
    }

    function export_credentials(e) {
        Analytics.event('Exporter', 'exported');

        var data = 'text/json;charset=utf-8,' + encodeURIComponent(CredentialStorage.asJSON());
        $(e.currentTarget).attr('href', 'data:' + data);
    }

    function clear_credentials(e) {
        Analytics.event('Credentials', 'cleared');

        modal(Translator.translate('clear_credentials_modal_title'), Translator.translate('clear_credentials_modal_text'), CredentialStorage.clearAll);
        e.preventDefault();
    }

    function init() {
        import_output = $('output.import-list');
        import_file_field = $('#import-file');
        import_json_field = $('#import-json');


        import_file_field.on('change', import_file);
        import_json_field.on('change', import_json);
        $('button.import-submit').on('click', import_credentials);

        $('#test-urls').on('blur', restore_test_input);
        $('#test-regex').on('keyup', test_regex);

        $('a.export-credentials').on('click', export_credentials);

        $('button.clear-all').on('click', clear_credentials);

        $('.multipass-version').text(chrome.runtime.getManifest()['version']);
    }

    return {
        'init': init
    };
}();

$(function () {
    Analytics.view('/options.html');
    Analytics.event('OptionPanel', 'opened');
    OptionPanel.init();
    Credentials.init();
});
