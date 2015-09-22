var Storage = function() {
    'use strict';

    var listener_callbacks = [];
    var storage = chrome.storage;
    var sync = storage.sync;

    function get(key, callback) {
        sync.get(key, function(result) {
            if (result.hasOwnProperty(key)) {
                for (var i in listener_callbacks) {
                    if (listener_callbacks.hasOwnProperty(i)) {
                        listener_callbacks[i](result[key]);
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
        sync.set(data);
    }

    function register(key, callback) {
        if (typeof(callback) !== 'undefined') {
            listener_callbacks.push(callback);
        }

        storage.onChanged.addListener(function (changes, namespace) {
            if (namespace === 'sync' && changes.hasOwnProperty(key)) {
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
