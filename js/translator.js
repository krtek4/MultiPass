var Translator = function() {
    'use strict';

    function translate(key) {
        return chrome.i18n.getMessage(key);
    }

    return {
        'translate': translate
    }
}();
