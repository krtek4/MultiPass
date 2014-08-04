var Option = function() {
    'use strict';

    var credentials = [];
    var import_output;

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
        });

        $('button.clear-all').on('click', function(event) {
            modal('Clear all credentials', 'Are you sure you want to remove all credentials ?', function() {
                Storage.clearAll();
            });
            event.preventDefault();
        });
    }

    return {
        'init': init
    }
}();

$(function () {
    Analytics.event('Options', 'opened');
    Option.init();
});
