var Popin = function() {
    'use strict';

    function init() {
        $('.option-link').on('click', function() {
            Analytics.event('Popin', 'option link');
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
