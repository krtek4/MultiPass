'use strict';

module.exports = function() {
    var manifest = chrome.runtime.getManifest();

    /*eslint-disable */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    var browser = manifest.hasOwnProperty('developer') ? 'opera' : manifest.hasOwnProperty('applications') ? 'firefox' : 'chrome';

    ga('create', 'UA-1168006-9', 'auto');
    ga('set', 'appName', manifest['short_name']);
    ga('set', 'appVersion', manifest['version']);
    ga('set', 'appInstallerId', browser);
    ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('require', 'displayfeatures');

    var screen = function(name) {
        ga('send', 'screenview', { 'screenName': name });
    };

    var event = function(event, action, value) {
        ga('send', 'event', event, action, value, { nonInteraction: true });
    };

    var interaction = function(event, action, value) {
        ga('send', 'event', event, action, value);
    };

    var exception = function(description) {
        ga('send', 'exception', { 'exDescription': description, 'exFatal': false });
    };

    /*eslint-enable */

    return {
        'view': screen,
        'event': event,
        'interaction': interaction,
        'exception': exception
    };
}();
