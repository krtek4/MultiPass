/*global chrome:True*/
'use strict';

var CredentialStorage = require('./credential_storage');

// the popin and option pane needs this to save the temporary item
// window.Storage = require('./storage');

var Extension = function () {
    var statuses = {};
    var max_try = 5;

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
        var re = statuses.hasOwnProperty(tab_id) && statuses[tab_id].credentials.length > 0 ?
            new RegExp(statuses[tab_id].credentials[0].url) : false;

        if (re !== false && re.test(url)) {
            var color = statuses[tab_id].credentials.length > 1 ? '#FFFF00' : '#00FF00';
            if(statuses[tab_id].count > max_try) { // fail
                color = '#FF0000';
            }

            chrome.action.setBadgeText({ text: ' ' });
            chrome.action.setBadgeBackgroundColor({ color: color });
        } else {
            chrome.action.setBadgeText({text: ''});
            delete statuses[tab_id];
        }
    }

    function retrieveCredentials(status) {
        var credentials = CredentialStorage.getCredentials(status);

        if(statuses.hasOwnProperty(status.tabId) && statuses[status.tabId].requestId == status.requestId) {
            statuses[status.tabId].count += 1;
        } else {
            statuses[status.tabId] = {
                credentials: credentials,
                count: 0,
                requestId: status.requestId
            };
        }

        return credentials.length == 0 || statuses[status.tabId].count > max_try ? {} : {
            authCredentials: {
                username: credentials[0].username,
                password: credentials[0].password
            }
        };
    }

    function suggester(status) {
        if(statuses.hasOwnProperty(status.tabId)) {
            if(statuses[status.tabId].credentials.length == 0) {
                // no credentials found
            } else {
                if (statuses[status.tabId].credentials.length > 1) {
                    // multiple credentials
                }

                if (statuses[status.tabId].count > max_try) {
                    // failed authentication
                } else {
                    // authentication sent
                }
            }
        }
    }

    function init() {
        chrome.webRequest.onAuthRequired.addListener(retrieveCredentials, {urls: ['<all_urls>']}, ['blocking']);

        chrome.webRequest.onCompleted.addListener(suggester, {urls: ['<all_urls>']});

        chrome.tabs.onUpdated.addListener(showBadgeForTabId);
        chrome.tabs.onActivated.addListener(showBadgeForStatus);
    }

    return {
        'init': init
    };
}();

Extension.init();
