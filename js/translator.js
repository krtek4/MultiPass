'use strict';

module.exports = function() {
    function translate(key) {
        return chrome.i18n.getMessage(key);
    }

    function translateHtml() {
        var els = document.querySelectorAll('[data-i18n]');

        [].forEach.call(els, function (el) {
            el.innerText = translate(el.getAttribute('data-i18n'));
        });
    }

    translateHtml();

    return {
        'translate': translate
    };
}();
