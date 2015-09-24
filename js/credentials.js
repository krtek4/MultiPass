'use strict';

var React = require('react');
var Table = require('./components/table');

module.exports = function() {
    function init() {
        React.render(<Table />, document.getElementById('credential-table-container'));
    }

    return {
        'init': init
    };
}();
