var Popin = function() {
    'use strict';

    function init() {
        $('.option-link').on('click', function() {
            chrome.tabs.create({'url': chrome.extension.getURL("options.html") })
        })
    }

    return {
        'init': init
    }
}();

$(function () {
    Analytics.event('Popin', 'opened');
    Popin.init();
});
