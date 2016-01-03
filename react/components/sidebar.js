var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
/**
 * @jsx React.DOM
 */

var Sidebar = React.createClass({

  render: function() {
    return (
        <div id="sidebar" className="sidebar-fixed hide-sidebar">
            <div className="sidebar-inner">
                <ul id="sideNav" className="nav nav-pills nav-stacked">
                    <li><Link to="app">Главная</Link></li>
                </ul>
            </div>
        </div>
    );
  }
});

module.exports = Sidebar;
