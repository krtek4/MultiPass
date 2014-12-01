var CredentialStorage = function() {
    'use strict';

    var credentials = [];

    var variable_name = 'credentials';

    var last_request_id = '';
    var last_tab_id = '';
    var try_count = 0;

    function addCredential(credential) {
        credentials.push(credential);
        Storage.set(variable_name, credentials);

        return credential;
    }

    function removeCredential(index) {
        var credential = credentials.splice(index, 1);
        Storage.set(variable_name, credentials);

        return credential;
    }

    function clearAll() {
        credentials = [];
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
        var success_color = "#00FF00";

        if(found.length > 0) {
            credential = found[0];
        }

        // display a yellow badge if there is multiple match for the url
        if (found.length > 1) {
            success_color = "#FFFF00";
            Analytics.event('BackgroundApp', 'multiple credentials');
        }

        if (credential.hasOwnProperty('username') && credential.hasOwnProperty('password')) {
            if (status.requestId == last_request_id && status.tabId == last_tab_id) {
                ++try_count;
            } else {
                try_count = 0;
            }

            if(try_count == 0) {
                Analytics.event('BackgroundApp', 'authentication sent');
            }

            if(try_count < 5) {
                last_request_id = status.requestId;
                last_tab_id = status.tabId;

                cb(" ", success_color, credential, status.tabId);
                return {
                    authCredentials: {
                        username: credential.username,
                        password: credential.password
                    }
                };
            } else {
                Analytics.event('BackgroundApp', 'failed authentication');

                cb(" ", "#FF0000", credential, status.tabId);
            }
        }

        return {};
    }

    function register(callback) {
        Storage.register(variable_name, callback);
    }

    // retrieve the credentials from storage
    Storage.get(variable_name, function(result) {
        credentials = result;
    });

    return {
        'register': register,

        'getCredential': getCredential,

        'removeCredential': removeCredential,
        'clearAll': clearAll,
        'addCredential': addCredential,
        'asJSON': function() { return JSON.stringify(credentials); },

        'getRegexp': getRegexp
    }
}();
