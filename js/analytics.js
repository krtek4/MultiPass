'use strict';

var _gaq = _gaq || [];

module.exports = function() {
    var push = function (type, event, action) {
        _gaq.push([type, event, action]);
    };

    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    try {
        s.parentNode.insertBefore(ga, s);
    } catch(err) {
        // in case of error, redefine push to do nothing
        push = function () {};
    }

    push('_setAccount', 'UA-1168006-9');
    push('_trackPageview');

    return {
        'event': function(event, action) {
            push('_trackEvent', event, action);
        }
    };
}();
