/*global chrome:True*/
'use strict';

var $ = require('jquery');
var React = require('react');

var Analytics = require('../../js/analytics');
var PopinComponent = require('../../js/components/popin');

var Popin = function() {
    var only_match = 'only-match';
    var multiple_match = 'multiple-match';

    function highlightUrlForTab(tab) {
        // TODO: move this to the Table component somehow
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
        chrome.tabs.getSelected(null, highlightUrlForTab);
        chrome.tabs.onUpdated.addListener(highlightUrlForTabId);
        chrome.tabs.onActivated.addListener(highlightUrlForStatus);

        React.render(<PopinComponent />, document.getElementById('react-container'));
    }

    return {
        'init': init
    };
}();

$(function() {
    Popin.init();
});
