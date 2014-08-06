var Extension = function () {
    'use strict';


    var last_request_id = '';
    var last_tab_id = '';
    var try_count = 0;
    var success_timeout;

    function showBadge(text, color, tab_id) {
        chrome.browserAction.setBadgeText({
            text: text,
            tabId: tab_id
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: color,
            tabId: tab_id
        });
    }

    function showNotification(title, message, timeout) {
        timeout = (typeof timeout !== 'undefined') ? timeout : 0;

        console.log(title + ' : ' + message);

        // Hide notification
        if (timeout > 0) {
            setTimeout(function() {
                console.log('notification timeout reached')
            }, timeout);
        }
    }

    function retrieveCredentials(status) {
        var credential = Storage.getForUrl(status.url);

        if (credential.hasOwnProperty('username') && credential.hasOwnProperty('password')) {
            if (status.requestId == last_request_id && status.tabId == last_tab_id) {
                ++try_count;
            } else {
                try_count = 0;
            }

            if(try_count < 5) {
                last_request_id = status.requestId;
                last_tab_id = status.tabId;

                if(typeof(success_timeout) === 'undefined' || success_timeout === '') {
                    success_timeout = setTimeout(function () {
                        success_timeout = '';
                        showBadge(" ", "#00FF00", status.tabId);
                    }, 1000);
                }

                return {
                    authCredentials: {
                        username: credential.username,
                        password: credential.password
                    }
                };
            } else {
                clearTimeout(success_timeout);
                success_timeout = '';
                showBadge(" ", "#FF0000", status.tabId);
            }
        }

        return {};
    }

    function init() {
        Storage.addListener();
        chrome.webRequest.onAuthRequired.addListener(retrieveCredentials, {urls: ["<all_urls>"]}, ["blocking"]);
    }

    return {
        'init': init
    };
}();


Analytics.event('BackgroundApp', 'loaded');
Extension.init();
