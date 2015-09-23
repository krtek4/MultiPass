/*global chrome:True*/
'use strict';

module.exports = function() {
    function translate(key) {
        return chrome.i18n.getMessage(key);
    }

    return {
        'translate': translate
    };
}();
