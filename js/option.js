var Option = function() {
    'use strict';

    var credentials = [];
    var import_output;

    function init() {
        import_output = $('output.import-list');

        $('#import').on('change', function(e) {
            var files = e.target.files;

            var ul = $('<ul>');
            import_output.empty().append(ul);

            credentials = [];
            for (var i = 0, file; file = files[i]; ++i) {
                var reader = new FileReader();
                reader.onloadend = function (event) {
                    if (event.target.readyState == FileReader.DONE) {
                        try {
                            var json = JSON.parse(event.target.result);

                            for (var key in json) {
                                if (json.hasOwnProperty(key)) {
                                    var c = json[key];
                                    credentials.push(c);

                                    var li = $('<li>' + c.url + ' : ' + c.username + ' - ' + c.password + '</li>');
                                    ul.append(li);
                                }
                            }
                        } catch(err) {
                            console.log('JSON file is malformed.');
                            console.log(event);
                        }
                    } else {
                        console.log('Error reading the file.');
                        console.log(event);
                    }
                };
                reader.readAsText(file);
            }
        });

        $('button.import-submit').on('click', function(event) {
            for (var key in credentials) {
                if (credentials.hasOwnProperty(key)) {
                    Storage.addCredential(credentials[key]);
                }
            }

            credentials = [];
            import_output.empty();

            event.preventDefault();
        });

        $('a.export-credentials').on('click', function(event) {
            var data = "text/json;charset=utf-8," + encodeURIComponent(Storage.asJSON());
            $(this).attr('href', 'data:' + data);
        })
    }

    return {
        'init': init
    }
}();

$(function () {
    Analytics.event('Options', 'opened');
    Option.init();
});
