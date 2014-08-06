var Extension = function () {
    'use strict';

    var last_request_id = '';
    var last_tab_id = '';
    var try_count = 0;

    var tab_badges = {};

    function createBadge(text, color, tab_id) {
        tab_badges[tab_id] = {
            text: text,
            color: color
        };
    }

    function showBadge(tab_id) {
        if (tab_badges.hasOwnProperty(tab_id)) {
            chrome.browserAction.setBadgeText({ text: tab_badges[tab_id].text });
            chrome.browserAction.setBadgeBackgroundColor({ color: tab_badges[tab_id].color });
        } else {
            chrome.browserAction.setBadgeText({text: ''});
        }
    }

    function retrieveCredentials(status) {
        var credentials = Storage.getForUrl(status.url);
        var credential = {};
        var success_color = "#00FF00";

        if(credentials.length > 0) {
            credential = credentials[0];
        }

        // display a yellow badge if there is multiple match for the url
        if (credentials.length > 1) {
            success_color = "#FFFF00";
        }

        if (credential.hasOwnProperty('username') && credential.hasOwnProperty('password')) {
            if (status.requestId == last_request_id && status.tabId == last_tab_id) {
                ++try_count;
            } else {
                try_count = 0;
            }

            if(try_count < 5) {
                last_request_id = status.requestId;
                last_tab_id = status.tabId;

                createBadge(" ", success_color, status.tabId);
                return {
                    authCredentials: {
                        username: credential.username,
                        password: credential.password
                    }
                };
            } else {
                createBadge(" ", "#FF0000", status.tabId);
            }
        }

        return {};
    }

    function init() {
        Storage.addListener();
        chrome.webRequest.onAuthRequired.addListener(retrieveCredentials, {urls: ["<all_urls>"]}, ["blocking"]);

        chrome.tabs.onUpdated.addListener(showBadge);
        chrome.tabs.onActivated.addListener(function(status) {
            showBadge(status.tabId);
        });
    }

    return {
        'init': init
    };
}();


Analytics.event('BackgroundApp', 'loaded');
Extension.init();
