var React = require('react');
var Field = require('./field');

var Fields = React.createClass({
    handleFieldChange : function(prop, value){
        this.props.handleChange(prop,this.props.index,value);
    },
    handleDelete:function(){
        this.props.deleteFields(this.props.index);
    },
    handleMove:function(direction){
        this.props.moveFields(direction, this.props.index);
    },
    render: function() {
        return (
            <div className="row" key={this.props.index}>
                <div className="col-xs-3">
                    <Field handleFieldChange={this.handleFieldChange.bind(null,'name')} value={this.props.field.name}/>
                </div>
                <div className="col-xs-2">
                    <Field handleFieldChange={this.handleFieldChange.bind(null,'type')} value={this.props.field.type} list={true}/>
                </div>
                <div className="col-xs-1">
                    <Field handleFieldChange={this.handleFieldChange.bind(null,'length')} value={this.props.field.length}/>
                </div>
                <div className="col-xs-1">
                    <Field handleFieldChange={this.handleFieldChange.bind(null,'default')} value={this.props.field.default}/>
                </div>
                <div className="col-xs-1">
                    <Field type="checkbox" handleFieldChange={this.handleFieldChange.bind(null,'index')} value={this.props.field.index}/>
                </div>
                <div className="col-xs-1">
                    <Field type="checkbox" handleFieldChange={this.handleFieldChange.bind(null,'unsigned')} value={this.props.field.unsigned}/>
                </div>
                <div className="col-xs-1">
                    <Field type="checkbox" handleFieldChange={this.handleFieldChange.bind(null,'required')} value={this.props.field.required}/>
                </div>
                <div className="col-xs-2 btn-toolbar">
                    <div className="btn-group">
                        <button type="button" className="btn btn-success" onClick={this.handleMove.bind(null,0)}><i className="im-arrow-up"></i></button>
                        <button type="button" className="btn btn-success" onClick={this.handleMove.bind(null,1)}><i className="im-arrow-down3"></i></button>
                    </div>

                    <button type="button" className="btn btn-danger" onClick={this.handleDelete}><i className="ec-trashcan"></i></button>
                </div>
            </div>
        );
    }

});

module.exports = Fields;