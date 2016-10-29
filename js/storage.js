'use strict';

module.exports = function() {
    var storage = chrome.storage;
    var storageNamespace = storage.sync ? 'sync' : 'local';
    var dataStore = storage[storageNamespace];

    var listener_callbacks = {};

    function get(key, callback) {
        dataStore.get(key, function(result) {
            if (result.hasOwnProperty(key)) {
                if(typeof(listener_callbacks[key]) != 'undefined') {
                    for (var i in listener_callbacks[key]) {
                        if (listener_callbacks[key].hasOwnProperty(i)) {
                            listener_callbacks[key][i](result[key]);
                        }
                    }
                }

                if(typeof(callback) !== 'undefined') {
                    callback(result[key]);
                }
            }
        });
    }

    function set(key, value) {
        var data = {};
        data[key] = value;
        dataStore.set(data);
    }

    function register(key, callback) {
        if (typeof(callback) !== 'undefined') {
            if(typeof(listener_callbacks[key]) == 'undefined') {
                listener_callbacks[key] = [];
            }
            listener_callbacks[key].push(callback);
        }

        storage.onChanged.addListener(function (changes, namespace) {
            if (namespace === storageNamespace && changes.hasOwnProperty(key)) {
                if(typeof(callback) !== 'undefined') {
                    callback(changes[key].newValue);
                }

                return changes[key].newValue;
            }
        });
    }

    return {
        'get': get,
        'set': set,
        'register': register
    };
}();
