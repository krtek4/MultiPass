'use strict';

module.exports = function() {
    /*eslint-disable */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-1168006-9', 'auto');
    ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('require', 'displayfeatures');

    var push = function (type, event, action) {
        ga('send', type, event, action);
    };
    /*eslint-enable */

    return {
        'view': function(name) { push('pageview', name); },
        'event': function(event, action) { push('event', event, action); }
    };
}();
