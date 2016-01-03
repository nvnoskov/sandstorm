var React = require('react');

var Field = React.createClass({
    handleChange:function(type,event){
        this.props.handleFieldChange(type=='checkbox'?event.target.checked:event.target.value)
    },
    render: function() {
        if(this.props.type=="checkbox"){
            return (
                <input
                    className="form-control noStyle input-sm" type="checkbox"
                    onChange={this.handleChange.bind(null,"checkbox")}
                    checked={this.props.value} />
            );
        }else{

            return (
                <input
                    className="form-control" type="text" list={this.props.list?'types':''}
                    onChange={this.handleChange.bind(null,"text")}
                    value={this.props.value} />
            );
        }
    }

});

module.exports = Field;