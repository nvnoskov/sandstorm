var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
/**
 * @jsx React.DOM
 */

var Header = React.createClass({
  render: function() {

    return (
      <div id="header">
    <div className="container-fluid">
        <div className="navbar">
            <div className="navbar-header">
                <a className="navbar-brand" href="">
                    <img src="assets/img/sandstorm-40.png"/>                    
                </a>
            </div>
            <nav className="top-nav" role="navigation">
                <ul className="nav navbar-nav pull-left">        
                    <li>
                        <Link to="projects"><i className="im-folder-open"></i> Projects</Link>
                    </li>      
                    <li>
                        <Link to="generate"><i className="ec-cog"></i> Generate</Link>
                    </li>
                </ul>
                <ul className="nav navbar-nav pull-right">
                    <li>
                        <Link to="setting"><i className="st-settings"></i> Settings</Link>
                    </li>
                </ul>
            </nav>
            </div>
        </div>
    </div>
    );
  }
});
module.exports = Header;

