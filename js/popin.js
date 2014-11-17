var Popin = function() {
    'use strict';

    var only_match = 'only-match';
    var multiple_match = 'multiple-match';

    function optionLink() {
        Analytics.event('Popin', 'option link');
        chrome.tabs.create({'url': chrome.extension.getURL("options.html") })
    }

    function highlightUrlForTab(tab) {
        var container = $('.credentials');
        container.find('tr').removeClass(only_match + ' ' + multiple_match);

        var matches = [];
        container.find('.url').each(function() {
            var re = new RegExp($(this).text());
            if (re.test(tab.url)) {
                matches.push($(this).parent());
            }
        });

        var clazz = matches.length > 1 ? multiple_match : only_match;
        matches.map(function(a) { a.addClass(clazz); });
    }

    function highlightUrlForTabId(tab_id) {
        chrome.tabs.get(tab_id, highlightUrlForTab);
    }

    function highlightUrlForStatus(status) {
        highlightUrlForTabId(status.tabId);
    }

    function init() {
        $('.option-link').on('click', optionLink);

        chrome.tabs.getSelected(null, highlightUrlForTab);
        chrome.tabs.onUpdated.addListener(highlightUrlForTabId);
        chrome.tabs.onActivated.addListener(highlightUrlForStatus);
    }

    return {
        'init': init
    }
}();

$(function () {
    Analytics.event('Popin', 'opened');
    Popin.init();
});
