'use strict';

var React = require('react');

var CredentialStorage = require('./credential_storage');
var Storage = require('./storage');

var Table = require('./components/table');

module.exports = function() {
    var storage_key = 'temporary-credentials';
    var table;

    function display_credentials(credentials) {
        table = React.render(<Table credentials={credentials} />, document.getElementById('credential-table-container'));
    }

    function init() {
        CredentialStorage.register(display_credentials);

        Storage.get(storage_key, function(result) {
            table.setState(result);
            Storage.set(storage_key, {});
        });

        addEventListener('unload', function () {
            chrome.extension.getBackgroundPage().Storage.set.apply(this, [storage_key, table.getState()]);
        });
    }

    return {
        'init': init
    };
}();
