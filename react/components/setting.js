var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Setting = React.createClass({
    getInitialState: function() {
        var giiCrud = localStorage.giiCrud||'gii/crud';
        var giiModel = localStorage.giiModel||'gii/model';
        return {
            path:localStorage.path,
            projectsDir:localStorage.projectsDir,
            giiCrud:giiCrud,
            giiModel:giiModel
        };
    },
    componentDidMount: function() {

    },
    _onSubmit:function(){        
        var values = $('#setting-form').serializeArray();
        var newState = {};
        for( i in values){
            localStorage[values[i]['name']] = values[i]['value'];
            newState[values[i]['name']] = values[i]['value'];
        }        
        this.setState(newState);
        
    },
    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 heading">
                        <h1 className="page-header"><i className="st-settings"></i> Setting</h1>
                        <div className="option-buttons">
                            <div className="btn-toolbar" role="toolbar">
                                <div className="btn-group">
                                    <a id="clear-localstorage" className="btn tip" title="Reset panels position">
                                        <i className="ec-refresh color-red s24"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="outlet">
                    <br/>
                    <form className="form-horizontal group-border hover-stripped" id="setting-form" role="form" onSubmit={this._onSubmit}>                    
                        <div className="form-group">
                            <label className="col-lg-2 col-md-2 col-sm-12 control-label">Path to projects</label>
                            <div className="col-lg-10 col-md-10">
                                <input defaultValue={this.state.projectsDir} id="projectsDir" name="projectsDir" type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-lg-2 col-md-2 col-sm-12 control-label">Gii Model Command</label>
                            <div className="col-lg-10 col-md-10">
                                <input defaultValue={this.state.giiModel} id="giiModel" name="giiModel" type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-lg-2 col-md-2 col-sm-12 control-label">Gii Crud Command</label>
                            <div className="col-lg-10 col-md-10">
                                <input defaultValue={this.state.giiCrud} id="giiCrud" name="giiCrud" type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-lg-2 col-md-2 col-sm-12 control-label">Path to last work dir</label>
                            <div className="col-lg-10 col-md-10">
                                <input defaultValue={this.state.path} id="fileDialog" readOnly className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-lg-2 col-md-2 col-sm-12 control-label">Templates (JSON dump)</label>
                            <div className="col-lg-10 col-md-10">
                                <textarea className="form-control" name="templates" ref="jsondump" rows="10">
                                    {localStorage.templates}
                                </textarea>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="col-lg-10 col-md-10 col-md-offset-2">
                                <button type="submit" className="btn btn-success">Save</button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        );
    }

});

module.exports = Setting;