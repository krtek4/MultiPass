'use strict';

var React = require('react');
var ui = require('material-ui');

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
    render: function() {
        return (
            <tr>
                <td className="url">{this.props.url}</td>
                <td className="username">{this.props.username}</td>
                <PasswordCell password={this.props.password} />
                <td>
                    <button type="button" className="remove" data-url={this.props.url}>{Translator.translate("remove_credential")}</button>
                    <button type="button" className="edit" data-url={this.props.url}>{Translator.translate("edit_credential")}</button>
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

   render: function() {
       var rows = [];
       for(var i in this.props.credentials) {
           if(this.props.credentials.hasOwnProperty(i)) {
               var c = this.props.credentials[i];
               rows.push(<CredentialRow key={c.url} url={c.url} username={c.username} password={c.password}/>)
           }
       }
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
                               <input id="url" name="url" hintText="URL, this is a regexp" />
                           </td>
                           <td>
                               <input id="username" name="username" hintText="Username" />
                           </td>
                           <td>
                               <input id="password" name="password" hintText="Password" />
                           </td>
                           <td>
                               <button className="credential-form-submit" type="submit">{Translator.translate("add_credential")}</button>
                               <button className="credential-form-reset" type="reset">{Translator.translate("reset_credential")}</button>
                           </td>
                       </tr>
                   </tfoot>
               </table>
           </form>
       );
   }
});

module.exports = CredentialTable;
