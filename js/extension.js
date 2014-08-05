var Extension = function () {
    'use strict';


    var last_request_id = '';
    var last_tab_id = '';
    var try_count = 0;

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

                return {
                    authCredentials: {
                        username: credential.username,
                        password: credential.password
                    }
                };
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
