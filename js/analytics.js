'use strict';

var Storage = require('./storage');

module.exports = function() {
    var manifest = chrome.runtime.getManifest();
    var browser = manifest.hasOwnProperty('developer') ? 'opera' : manifest.hasOwnProperty('applications') ? 'firefox' : 'chrome';

    var queue = [];
    var ga_enabled = false;

    var init = function(enable) {
        if(browser == 'firefox' || enable == false) {
            send = function() {};
            queue = [];
            return;
        }

        if(ga_enabled === false) {
            /*eslint-disable */
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-1168006-9', 'auto');
            ga('set', 'appName', manifest['short_name']);
            ga('set', 'appVersion', manifest['version']);
            ga('set', 'appInstallerId', browser);
            ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
            // disable displayfeatures as it generates a lot of hits and we are past the limit
            // ga('require', 'displayfeatures');
            ga_enabled = true;
            /*eslint-enable */
        }

        send = function(type, a, b, c, d) {
            ga('send', type, a, b, c, d);
        };

        for(var i in queue) {
            send.apply(send, queue[i]);
        }
        queue = [];
    };

    var send = function(type, a, b, c, d) {
        queue.push([type, a, b, c, d]);
    };

    var screen = function(name) {
        send('screenview', { 'screenName': name });
    };

    var event = function(event, action, value) {
        send('event', event, action, value, { nonInteraction: true });
    };

    var interaction = function(event, action, value) {
        send('event', event, action, value);
    };

    var exception = function(description) {
        send('exception', { 'exDescription': description, 'exFatal': false });
    };

    var status = function(callback, new_value) {
        if(typeof(callback) === 'function') {
            Storage.register('analytics_enabled', callback);
        }

        if(typeof(new_value) !== 'undefined') {
            Storage.set('analytics_enabled', new_value);
        } else if(typeof(callback) === 'function') {
            Storage.get('analytics_enabled', callback, true);
        }
    };

    status(init);

    return {
        'view': screen,
        'event': event,
        'interaction': interaction,
        'exception': exception,
        'status': status
    };
}();
