'use strict';

var Analytics = require('./analytics');
var Storage = require('./storage');

module.exports = function() {
    var credentials = {};

    var variable_name = 'credentials';

    var last_request_id = '';
    var last_tab_id = '';
    var try_count = 0;

    function _key(key) {
        var hash = 0;
        var len = key.length;

        if (len === 0) {
            return hash;
        }

        for (var i = 0; i < len; i++) {
            var chr = key.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    function addCredential(credential) {
        credentials[_key(credential.url)] = credential;
        Storage.set(variable_name, credentials);

        return credential;
    }

    function removeCredential(url) {
        var key = _key(url);
        var credential = credentials[key];
        delete credentials[key];
        Storage.set(variable_name, credentials);

        return credential;
    }

    function clearAll() {
        credentials = {};
        Storage.set(variable_name, credentials);
    }

    function getRegexp(credential) {
        return new RegExp(credential.url);
    }

    function getCredential(status, cb) {
        var url = status.url;
        var found = [];
        for (var key in credentials) {
            if (credentials.hasOwnProperty(key)) {
                var re = getRegexp(credentials[key]);
                if (re.test(url)) {
                    found.push(credentials[key]);
                }
            }
        }

        var credential = {};
        var success_color = '#00FF00';

        if(found.length > 0) {
            credential = found[0];
        }

        // display a yellow badge if there is multiple match for the url
        if (found.length > 1) {
            success_color = '#FFFF00';
            Analytics.event('BackgroundApp', 'multiple credentials');
        }

        if (credential.hasOwnProperty('username') && credential.hasOwnProperty('password')) {
            if (status.requestId == last_request_id && status.tabId == last_tab_id) {
                ++try_count;
            } else {
                try_count = 0;
            }

            if(try_count === 0) {
                Analytics.event('BackgroundApp', 'authentication sent');
            }

            if(try_count < 5) {
                last_request_id = status.requestId;
                last_tab_id = status.tabId;

                cb(' ', success_color, credential, status.tabId);
                return {
                    authCredentials: {
                        username: credential.username,
                        password: credential.password
                    }
                };
            } else {
                Analytics.event('BackgroundApp', 'failed authentication');

                cb(' ', '#FF0000', credential, status.tabId);
            }
        }

        return {};
    }

    function register(callback) {
        Storage.register(variable_name, callback);
    }

    // retrieve the credentials from storage
    Storage.get(variable_name, function(result) {
        // convert from the old storage format
        if(Array.isArray(result)) {
            credentials = {};

            for (var key in result) {
                if (result.hasOwnProperty(key)) {
                    credentials[_key(result[key].url)] = result[key];
                }
            }

            Storage.set(variable_name, credentials);
        } else {
            credentials = result;
        }
    });

    return {
        'register': register,

        'getCredential': getCredential,

        'removeCredential': removeCredential,
        'clearAll': clearAll,
        'addCredential': addCredential,
        'asJSON': function() { return JSON.stringify(credentials); },

        'getRegexp': getRegexp
    };
}();
