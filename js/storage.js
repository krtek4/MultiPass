var Storage = function() {
    'use strict';

    var credentials = [];
    var listener_callbacks = [];
    var storage = chrome.storage;
    var sync = storage.sync;

    var variable_name = 'credentials';

    function getCredentialsReturn(result) {
        if (result.hasOwnProperty(variable_name)) {
            credentials = result.credentials;

            for (var key in listener_callbacks) {
                if (listener_callbacks.hasOwnProperty(key)) {
                    listener_callbacks[key](credentials);
                }
            }
        }
    }

    function getCredentials() {
        sync.get(variable_name, getCredentialsReturn);
    }

    function setCredentials() {
        var data = {};
        data[variable_name] = credentials;
        sync.set(data);
    }

    function addCredential(credential) {
        credentials.push(credential);
        setCredentials();

        return credential;
    }

    function removeCredential(index) {
        var credential = credentials.splice(index, 1);
        setCredentials();

        return credential;
    }

    function clearAll() {
        credentials = [];
        setCredentials();
    }

    function getRegexp(credential) {
        return new RegExp(credential.url);
    }

    function getForUrl(url) {
        var found = [];
        for (var key in credentials) {
            if (credentials.hasOwnProperty(key)) {
                var re = getRegexp(credentials[key]);
                if (re.test(url)) {
                    found.push(credentials[key]);
                }
            }
        }

        return found;
    }

    function addListener(callback) {
        if (typeof(callback) !== 'undefined') {
            listener_callbacks.push(callback);
        }

        storage.onChanged.addListener(function (changes, namespace) {
            if (namespace === 'sync' && changes.hasOwnProperty(variable_name)) {
                credentials = changes[variable_name].newValue;

                if(typeof(callback) !== 'undefined') {
                    callback(credentials);
                }
            }
        });
    }

    // retrieve the credentials from sync
    getCredentials();

    return {
        'addListener': addListener,
        'removeCredential': removeCredential,
        'clearAll': clearAll,
        'addCredential': addCredential,
        'getForUrl': getForUrl,
        'getRegexp': getRegexp,
        'asJSON': function() { return JSON.stringify(credentials); }
    }
}();
