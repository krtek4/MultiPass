var Popin = function() {
    'use strict';

    function optionLink() {
        Analytics.event('Popin', 'option link');
        chrome.tabs.create({'url': chrome.extension.getURL("options.html") })
    }

    function init() {
        $('.option-link').on('click', optionLink);
    }

    return {
        'init': init
    }
}();

$(function () {
    Analytics.event('Popin', 'opened');
    Popin.init();
});
