'use strict';

module.exports = function() {
    function detectStorageNamespace(storage) {
        var ns = 'local';

        if(storage.sync) {
            ns = 'sync';

            try {
                var test = window[ns];
                var x = '__storage_test__';

                test.setItem(x, x);
                test.removeItem(x);
            }
            catch(e) {
                ns = 'local';
            }
        }

        return ns;
    }

    var storage = chrome.storage;
    var storageNamespace = detectStorageNamespace(storage);
    var dataStore = storage[storageNamespace];

    var listener_callbacks = {};

    function get(key, callback, default_value) {
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
            } else if(typeof(default_value) !== 'undefined') {
                callback(default_value);
            }
        });
    }

    function set(key, value) {
        var data = {};
        data[key] = value;
        dataStore.set(data);
    }

    function register(key, callback) {
        if(typeof(listener_callbacks[key]) == 'undefined') {
            listener_callbacks[key] = [];
        }
        listener_callbacks[key].push(callback);

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
