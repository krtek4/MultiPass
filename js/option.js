'use strict';

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
        var overlay = document.getElementsByClassName('overlay')[0].cloneNode(true);

        overlay.removeAttribute('style');

        var buttons = overlay.querySelectorAll('button, .close-button');
        [].forEach.call(buttons, function (el) {
            el.addEventListener('click', function() {
                overlay.classList.add('transparent');
                setTimeout(function () {
                    overlay.parentNode.removeChild(overlay);
                }, 1000);
            });
        });

        overlay.querySelector('.modal-confirm').addEventListener('click', confirmation);

        overlay.querySelector('.overlay-title').innerHTML = title;
        overlay.querySelector('.overlay-content').innerHTML = content;

        overlay.addEventListener('click', function () {
            overlay.querySelector('.page').classList.add('pulse');
            overlay.querySelector('.page').addEventListener('webkitAnimationEnd', function(e) {
                e.target.classList.remove('pulse');
            });
        });

        overlay.querySelector('.page').addEventListener('click', function(e) {
            e.stopPropagation();
        });

        document.body.appendChild(overlay);
    }

    function update_output_credentials() {
        var ul = document.createElement('ul');

        var display_credentials = credentials.concat(file_credentials);

        for (var key in display_credentials) {
            if (display_credentials.hasOwnProperty(key)) {
                var c = Credentials.sanitize_credential(display_credentials[key]);
                ul.innerHTML += '<li>' + c.url + ' : ' + c.username + ' - ' + c.password + ' - ' + c.priority + '</li>';
            }
        }

        import_output.innerHTML = '';
        import_output.appendChild(ul);
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
            // malformed JSON
        }

        return result;
    }

    function readerOnLoadEnd(event) {
        if (event.target.readyState == FileReader.DONE) {
            file_credentials = file_credentials.concat(parse_json(event.target.result));
            update_output_credentials();
        }
    }

    function import_file(e) {
        var files = e.target.files;
        var len = files.length;

        for (var i = 0; i < len; ++i) {
            var reader = new FileReader();
            reader.onloadend = readerOnLoadEnd;
            reader.readAsText(files[i]);
        }
    }

    function import_json() {
        credentials = parse_json(import_json_field.value);
        update_output_credentials();
    }

    function import_credentials(e) {
        var new_credentials = credentials.concat(file_credentials);

        for (var key in new_credentials) {
            if (new_credentials.hasOwnProperty(key)) {
                CredentialStorage.addCredential(new_credentials[key]);
            }
        }

        credentials = [];
        file_credentials = [];
        import_output.innerHTML = '';
        import_file_field.value = '';
        import_json_field.value = '';

        e.preventDefault();
    }

    function restore_test_input() {
        var lis = document.querySelectorAll('#test-urls li');
        if(lis.length == 0) {
            document.getElementById('test-urls').innerHTML = '<li>http://www.example.com</li>';
        }
        test_regex();
    }

    function test_regex() {
        var regex = document.getElementById('test-regex').value;

        var lis = document.querySelectorAll('#test-urls li');
        [].forEach.call(lis, function (el) {
            var re = new RegExp(regex);
            var url = el.innerText.trim();

            el.classList.toggle('matched', re.test(url) && url.length > 0);
        });
    }

    function export_credentials(e) {
        var data = 'text/json;charset=utf-8,' + encodeURIComponent(CredentialStorage.asJSON());
        e.target.setAttribute('href', 'data:' + data);
    }

    function clear_credentials(e) {
        modal(Translator.translate('clear_credentials_modal_title'), Translator.translate('clear_credentials_modal_text'), CredentialStorage.clearAll);
        e.preventDefault();
    }

    function init() {
        import_output = document.querySelector('output.import-list');
        import_file_field = document.getElementById('import-file');
        import_json_field = document.getElementById('import-json');

        import_file_field.addEventListener('change', import_file);
        import_json_field.addEventListener('change', import_json);
        document.querySelector('button.import-submit').addEventListener('click', import_credentials);

        document.getElementById('test-urls').addEventListener('blur', restore_test_input);
        document.getElementById('test-urls').addEventListener('keyup', test_regex);
        document.getElementById('test-regex').addEventListener('keyup', test_regex);

        document.querySelector('a.export-credentials').addEventListener('click', export_credentials);

        document.querySelector('button.clear-all').addEventListener('click', clear_credentials);

        document.getElementsByClassName('multipass-version')[0].innerText = chrome.runtime.getManifest()['version'];
    }

    return {
        'init': init
    };
}();

document.addEventListener('DOMContentLoaded', function () {
    OptionPanel.init();
    Credentials.init();
});
