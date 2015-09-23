'use strict';

var React = require('react');
var ui = require('material-ui');

var Analytics = require('../analytics');
var CredentialStorage = require('../credential_storage');
var Translator = require('../translator');

var PasswordCell = React.createClass({
    getInitialState: function() {
        return { 'shown': false };
    },

    handleClick: function() {
        this.setState({'shown' : ! this.state.shown });
    },

    render: function() {
        var content = this.state.shown ? this.props.password : '***';
        return (
            <td className="password">
                {content}
                <button onClick={this.handleClick} type="button" className="show-password">{Translator.translate("show_hide_password")}</button>
            </td>
        )
    }
});

var CredentialRow = React.createClass({
    clickRemove: function() {
        this.props.remove(this.props.url);
    },
    clickEdit: function() {
        this.props.edit(this.props.url, this.props.username, this.props.password);
    },
    render: function() {
        return (
            <tr className={this.props.editing ? 'editing' : ''}>
                <td className="url">{this.props.url}</td>
                <td className="username">{this.props.username}</td>
                <PasswordCell password={this.props.password} />
                <td>
                    <button type="button" onClick={this.clickRemove}>{Translator.translate("remove_credential")}</button>
                    <button type="button" onClick={this.clickEdit}>{Translator.translate("edit_credential")}</button>
                </td>
            </tr>
        );
    }
});

var ThemeManager = new ui.Styles.ThemeManager();
var Colors = ui.Styles.Colors;

var CredentialTable = React.createClass({
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    },
    componentWillMount: function() {
        ThemeManager.setPalette({
            accent1Color: Colors.deepOrange500
        });
    },

    getInitialState: function() {
        return {
            url: '',
            username: '',
            password: '',
            old_url: false
        };
    },
    getState: function() {
        return this.state;
    },

    editCredential: function(url, username, password) {
        this.setState({
            url: url,
            username: username,
            password: password,
            old_url: url
        });
    },
    addCredential: function() {
        var values = {
            url: this.state.url,
            username: this.state.username,
            password: this.state.password
        };

        var valid = true;
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                var v = values[key];

                if(v === '') {
                    console.error('Error - ' + key + ' : ' + v + ' is empty !');
                    valid = false;
                }
            }
        }

        if(valid) {
            if(this.state.old_url.length > 0) {
                CredentialStorage.removeCredential(this.state.old_url);
                Analytics.event('Credentials', 'edited');
            } else {
                Analytics.event('Credentials', 'added');
            }

            CredentialStorage.addCredential(values);
            this.reset();
        } else {
            Analytics.event('Credentials', 'error in form');
        }
    },
    removeCredential: function(url) {
        CredentialStorage.removeCredential(url);
        Analytics.event('Credentials', 'removed');
    },
    handleChange: function(event) {
        var state = {};
        state[event.target.id] = event.target.value;
        this.setState(state);
    },
    reset: function() {
        this.setState(this.getInitialState());
    },

    render: function() {
        var rows = [];
        for (var i in this.props.credentials) {
            if (this.props.credentials.hasOwnProperty(i)) {
                var c = this.props.credentials[i];
                rows.push(<CredentialRow key={c.url}
                                         url={c.url} username={c.username} password={c.password}
                                         editing={c.url == this.state.old_url}
                                         remove={this.removeCredential} edit={this.editCredential}/>)
            }
        }

        var add_label = this.state.editing ? 'edit_credential' : 'add_credential';
        return (
           <form id="credential-form">
               <table className="credential-table">
                   <thead>
                       <tr>
                           <th>URL</th>
                           <th>Username</th>
                           <th>Password</th>
                           <th>Actions</th>
                       </tr>
                   </thead>
                   <tbody>
                       {rows}
                   </tbody>
                   <tfoot>
                       <tr>
                           <td>
                               <input value={this.state.url} onChange={this.handleChange} id="url" name="url" placeholde="URL, this is a regexp" />
                           </td>
                           <td>
                               <input value={this.state.username} onChange={this.handleChange} id="username" name="username" placeholde="Username" />
                           </td>
                           <td>
                               <input value={this.state.password} onChange={this.handleChange} id="password" name="password" placeholde="Password" />
                           </td>
                           <td>
                               <button className="credential-form-submit" type="submit" onClick={this.addCredential}>{Translator.translate(add_label)}</button>
                               <button className="credential-form-reset" type="reset" onClick={this.reset}>{Translator.translate("reset_credential")}</button>
                           </td>
                       </tr>
                   </tfoot>
               </table>
           </form>
       );
   }
});

module.exports = CredentialTable;
