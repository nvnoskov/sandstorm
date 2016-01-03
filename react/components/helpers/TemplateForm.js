var React = require('react');

var TemplateForm = React.createClass({
	_onShowContent:function(file){
		var content = fs.readFileSync('templates/'+file["content"].replace('@','')).toString();
		console.log(content);
		bootbox.dialog({
			message: "<pre>"+$('<div/>').text(content).html()+"</pre>",
			title: file["content"],
			buttons: {
				success: {
				  label: "OK",
				  className: "btn-primary btn-alt"
				}
			}
		});
	},
	render: function() {
		var template = this.props.template;
		var t = this;
		return (
			<div>
				<div className="panel-default plain" id="spr_5">    
                    <div className="panel-body  gray-bg">
                    	<div className="row">
                    		<div className="col-sm-6 col-md-6">
		                        <span className="label label-dark">Files:</span>
		                        {

		                        	template.files.map(function(file){
		                        		return (
		                        			<div>
		                        				{file["content"]!=undefined?<span>
		                        					<label className="label label-brown">Content: {file["content"]}</label>
		                        					<button type="button" className="btn btn-xs btn-info" onClick={t._onShowContent.bind(null,file)}><i className="fa-eye-open"/></button>
		                    					</span>:''}
		                        				{file["template"]!=undefined?<label className={file["exists"]?'label label-success':'label label-warning'}>Template: {file["template"]}</label>:''}
		                        			</div>
		                    			)
		                        	})
		                        }
	                        </div>
	                        <div className="col-sm-6 col-md-6">

		                        <span className="label label-danger">Required fields:</span>
		                        {

		                        	template.required.map(function(field,index){
		                        		return (
		                        			<div>		                        				
	                        					<label>{field["name"]}</label>
	                        					<input className="form-control" value={field["value"]} onChange={t.props.onChange.bind(null,index)}/>		                        						                        				
		                        			</div>
		                    			)
		                        	})
		                        }
	                        </div>
	                        <div className="col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4">
	                        	<br/>
	                        	<button type="button" className="btn btn-block btn-success" onClick={this.props.onGenerate} >Generate "{template.name}"</button>
	                        </div>
                        </div>
                    </div>
                </div>
			</div>
		);
	}

});

module.exports = TemplateForm;