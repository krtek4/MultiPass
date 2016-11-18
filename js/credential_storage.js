'use strict';

var Storage = require('./storage');

module.exports = function() {
    var credentials = {};

    var variable_name = 'credentials';

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

    function getCredentials(status) {
        var found = [];
        for (var key in credentials) {
            if (credentials.hasOwnProperty(key)) {
                var re = new RegExp(credentials[key].url);
                if (re.test(status.url)) {
                    found.push(credentials[key]);
                }
            }
        }

        return found;
    }

    function register(callback) {
        Storage.register(variable_name, callback);
        callback(credentials);
    }

    function updateCredentials(result)
    {
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
    }

    // retrieve the credentials from storage
    Storage.get(variable_name, updateCredentials);
    register(updateCredentials);

    return {
        'register': register,

        'getCredentials': getCredentials,

        'removeCredential': removeCredential,
        'clearAll': clearAll,
        'addCredential': addCredential,
        'asJSON': function() { return JSON.stringify(credentials); },
    };
}();
