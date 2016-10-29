/*global chrome:True*/
'use strict';

var Analytics = require('./analytics');
var CredentialStorage = require('./credential_storage');

// the popin and option pane needs this to save the temporary item
window.Storage = require('./storage');

var Extension = function () {
    var tab_badges = {};

    function createBadge(text, color, credential, tab_id) {
        tab_badges[tab_id] = {
            text: text,
            color: color,
            regexp: CredentialStorage.getRegexp(credential)
        };
    }

    function showBadeForTab(tab) {
        showBadge(tab.id, tab.url);
    }

    function showBadgeForTabId(tab_id) {
        chrome.tabs.get(tab_id, showBadeForTab);
    }

    function showBadgeForStatus(status) {
        showBadgeForTabId(status.tabId);
    }

    function showBadge(tab_id, url) {
        if (tab_badges.hasOwnProperty(tab_id) && tab_badges[tab_id].regexp.test(url)) {
            chrome.browserAction.setBadgeText({ text: tab_badges[tab_id].text });
            chrome.browserAction.setBadgeBackgroundColor({ color: tab_badges[tab_id].color });
        } else {
            chrome.browserAction.setBadgeText({text: ''});
        }
    }

    function retrieveCredentials(status) {
        return CredentialStorage.getCredential(status, createBadge);
    }

    function init() {
        CredentialStorage.register();
        chrome.webRequest.onAuthRequired.addListener(retrieveCredentials, {urls: ['<all_urls>']}, ['blocking']);

        chrome.tabs.onUpdated.addListener(showBadgeForTabId);
        chrome.tabs.onActivated.addListener(showBadgeForStatus);
    }

    return {
        'init': init
    };
}();


Analytics.event('BackgroundApp', 'loaded');
Extension.init();
