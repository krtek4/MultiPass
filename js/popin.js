/*global chrome:True*/
'use strict';

var Analytics = require('./analytics');
var Credentials = require('./credentials');

var Popin = function() {
    var only_match = 'only-match';
    var multiple_match = 'multiple-match';

    function optionLink() {
        Analytics.interaction('Popin', 'option link');
        chrome.runtime.openOptionsPage();
    }

    function highlightUrlForTab(tab) {
        if(Array.isArray(tab)) {
            tab = tab[0];
        }

        var container = document.getElementsByClassName('credentials')[0];
        var trs = container.getElementsByTagName('tr');
        [].forEach.call(trs, function (el) {
            el.classList.remove(only_match);
            el.classList.remove(multiple_match);
        });

        var matches = [];
        var urls = container.getElementsByClassName('url');
        [].forEach.call(urls, function (el) {
            var re = new RegExp(el.innerText);
            if (re.test(tab.url)) {
                matches.push(el.parentNode);
            }
        });

        var clazz = matches.length > 1 ? multiple_match : only_match;
        [].forEach.call(matches, function (el) {
            el.classList.add(clazz);
        });
    }

    function highlightUrlForTabId(tab_id) {
        chrome.tabs.get(tab_id, highlightUrlForTab);
    }

    function highlightUrlForStatus(status) {
        highlightUrlForTabId(status.tabId);
    }

    function init() {
        document.getElementsByClassName('option-link')[0].addEventListener('click', optionLink);

        chrome.tabs.query({currentWindow: true, active: true}, highlightUrlForTab);
        chrome.tabs.onUpdated.addListener(highlightUrlForTabId);
        chrome.tabs.onActivated.addListener(highlightUrlForStatus);
    }

    return {
        'init': init
    };
}();

document.addEventListener('DOMContentLoaded', function () {
    Analytics.view('Popin');
    Popin.init();
    Credentials.init();
});
