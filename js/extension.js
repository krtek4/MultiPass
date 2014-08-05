var Extension = function () {
    'use strict';

    function retrieveCredentials(status) {
        var credential = Storage.getForUrl(status.url);

        if (credential.hasOwnProperty('username') && credential.hasOwnProperty('password')) {
            return {
                authCredentials: {
                    username: credential.username,
                    password: credential.password
                }
            };
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
