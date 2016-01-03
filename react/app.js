var React = require('react');
var Router = require('react-router');

var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
// localStorage.path = '/home/anastasiya/www/nastya/';


console.log(localStorage);

var Header = require('./components/header');
var Sidebar = require('./components/sidebar');
var Content = require('./components/content');
var Setting = require('./components/setting');
var Projects = require('./components/projects');
var Generate = require('./components/generate');
var Html = require('./components/html');


var App = React.createClass({

    render: function() {
        return (
            <div>
              <Header/>
              <div id="content" className="full-page">
                  <div className="content-wrapper">
                      <RouteHandler/>
                  </div>
              </div>
          </div>
        );
    }

});


var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="setting" handler={Setting}/>
    <Route name="projects" handler={Projects}/>
    <Route name="generate" handler={Generate}>
    </Route>
    <Route name="html" handler={Html} />
    <DefaultRoute handler={Projects}/>
  </Route>
);


Router.run(routes, function (Handler, state) {
    var params = state.params;
    React.render(<Handler params={params}/>, document.getElementById('application'));
});
