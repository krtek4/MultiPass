'use strict';

var React = require('react');
var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

var Analytics = require('../analytics');
var Translator = require('../translator');

var Table = require('./table');

module.exports = React.createClass({
    componentWillMount: function() {
        Analytics.event('Popin', 'opened');
    },

    openOptionPane: function() {
        Analytics.event('Popin', 'option link');
        chrome.tabs.create({'url': chrome.extension.getURL('options.html') });
    },

    render: function() {
        return (
            <div>
                <Table />
                <p>For more features, go to <a href="#" onClick={this.openOptionPane}>the option page</a>.</p>
            </div>
        );
    }
});
