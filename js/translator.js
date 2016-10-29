'use strict';

var $ = require('jquery');

module.exports = function() {
    function translate(key) {
        return chrome.i18n.getMessage(key);
    }

    function translateHtml() {
        $('[data-i18n]').each(function(index, el) {
            $(el).text(translate($(el).data('i18n')));
        });
    }

    translateHtml();

    return {
        'translate': translate
    };
}();
