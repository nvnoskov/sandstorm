
var React = require('react');
var Router = require('react-router');
var TemplateHelper = require('./helpers/templateHelper');
var TemplateForm = require('./helpers/TemplateForm');
var TemplateStore = require('../stores/templates');
var TemplateActions = require('../actions/TemplateActions');
var objectAssign = require('object-assign');
var brace  = require('brace');
var AceEditor  = require('react-ace');
 
require('brace/mode/php')
require('brace/theme/tomorrow.js')

var Link = Router.Link;
function getAppState() {
  return {
    templates: TemplateStore.getTemplates()
  };
}
function getJsonTemplates(){
	var jsonTemplates = jsonTemplates || [];
	files = fs.readdirSync('templates/');
	files.forEach(function(file) {
		console.log(file.indexOf('.json'));
		if(file.indexOf('.json')!==-1){
			jsonTemplates.push(JSON.parse(fs.readFileSync('templates/'+file).toString("utf8")));
		}
	});
	return {
		'jsonTemplates':jsonTemplates
	}
}
var Html = React.createClass({
	getInitialState: function() {
		var states = objectAssign({
			pathToProject:localStorage.path||'/home/',
			path:'',
			log:'',
			file:'',
			showResults:false,
			cssFiles:[],
			jsFiles:[],
			jsonTemplates:[],
			templates:{
				blocks:[]
			},
			jsInline:[]
		},getAppState(),getJsonTemplates());
		return states;
	},
	componentDidMount: function() {
		TemplateStore.addChangeListener(this._onChange);		
	},	
	componentWillUnmount: function() {
		TemplateStore.removeChangeListener(this._onChange);
	},
	_onChange: function() {
		var appState = getAppState();
	    this.setState(appState);
	    this.checkJsonTemplates();
	  },
	onChangeFile:function(e){
		var file = e.target.value;
		path = file.split('/');
		path.splice(-1);
		this.setState({
			path:path.join('/'),
			file:file
		});
	},
	_onClickSet:function(e){
		var htmlString = fs.readFileSync(this.state.file).toString()
        var parsedHTML = cheerio.load(htmlString);
        var jsFiles = [], jsInline = [], cssFiles=[];
        parsedHTML('script').each(function(i, el) {
        	var t = cheerio(el);
		  // this === el 
		  var src = t.attr('src');
		  if(src){
		  	jsFiles.push( (src.indexOf('http://')===0?'':'public/template/')+src);
		  }else{
		  	jsInline.push(cheerio(el).html());
		  }
		});
        parsedHTML('link').each(function(i, el) {
        	var t = cheerio(el);
		  // this === el 
		  var href=t.attr('href');
		  if(href){
		  	cssFiles.push((href.indexOf('http://')===0?'':'public/template/')+href);
		  }
		});
		this.setState({
			jsFiles:jsFiles,
			jsInline:jsInline,
			cssFiles:cssFiles,
		});
	},
	_onClickAnalize:function(e){
		// Create a new window and get it
		pathToHtml = this.state.path;
		// 
		
	    //'http://sandstorm.nik/' 
		var new_win = gui.Window.open('file://'+this.state.file,
		{
			"width":1280,			
			"height":780,			
			"inject-js-end":'inject/inject.js'
		});
		// And listen to new window's focus event
		var t = this;
		new_win.on('loaded', function() {
			var d =new_win.window.document; 
			// jsLists = d.getElementsByTagName("script");
			// jsFiles = [];
			// for(i in jsLists){
			// 	if(jsLists[i].src){
			// 		jsFiles.push(jsLists[i].src.replace('file://'+t.state.path+'/','public/template/'));
			// 	}
			// }

			// cssLists = d.getElementsByTagName("link");
			// cssFiles = [];
			// for(i in cssLists){
			// 	if(cssLists[i].rel=='stylesheet'){
			// 		cssFiles.push(cssLists[i].href.replace('file://'+t.state.path+'/','public/template/'));
			// 	}
			// }
			// t.setState({
			// 	jsFiles:jsFiles,
			// 	cssFiles:cssFiles,
			// });
			var d =new_win.window.document; 
			var o=d.createElement("link");
			i=d.getElementsByTagName("script")[0];
			o.rel="stylesheet";
			o.href='http://inject.nik/inject.css';
			i.parentNode.insertBefore(o,i);
		});
	},
	_onMagic:function(){
        var log = [];
        var pathToProject = this.state.pathToProject;

        var generatedAsset = TemplateHelper.generateAssets(this.state.jsFiles, this.state.cssFiles);
        log.push(generatedAsset);        
        fs.writeFileSync(pathToProject+'/frontend/assets/AppAsset.php', generatedAsset)

        // Delete old files
        var cmd = "rm -rf " + pathToProject+"/frontend/web/public/template/*";        
        log.push("CMD: "+cmd);
        log.push(child_process.execSync(cmd).toString('utf8'));
	
		// Copy assset files
        var cmd = 'find '+this.state.path+' -type d -maxdepth 1 -mindepth 1 -exec cp -r "{}" '+ pathToProject+'/frontend/web/public/template/ \\;';
        log.push("CMD: "+cmd);
        log.push(child_process.execSync(cmd).toString('utf8'));

        // Create layout
    	log.push("Create layout ");
    	var generatedLayout = TemplateHelper.generateLayout(this.state.path);
    	fs.writeFileSync(pathToProject+'/frontend/views/layouts/structure.php', generatedLayout)
    	log.push(generatedLayout);    
        this.setState({
            'log':log.join("\n")
        });

        $.gritter.add({title: 'Выполнено'});

	},	
	_onApplyTemplate:function(i,evt){
		// var log = [];
		// var pathToProject = this.state.pathToProject;
		// var templates = this.state.templates;
		// var template = templates.blocks[i];
		// console.log(i,evt,template);
		// if(template){
			
		// 	if(template.type=='view'){
		    	
	 //            var route = template.name.trim('/');
	 //            var route = route.split('/');
	 //            if(route[1]==undefined){
	 //                route[1] = route[0];
	 //                route[0] = 'site';
	 //            }
	 //            fs.writeFileSync(pathToProject+'/frontend/views/'+route[0]+'/'+route[1]+'.php', template.html);
	 //            log.push('Path to file: '+pathToProject+'/frontend/views/'+route[0]+'/'+route[1]+'.php');    
	            
		//     }
		// }
		// this.setState({
  //           'log':log.join("\n")
  //       });
	},
	_onRemoveTemplate:function(index){
		var templates = this.state.templates;
		templates.blocks.splice(index,1);
		this.setState({
			templates:templates
		});
	},
	_onChangeTemplate:function(i,field,evt){
		var templates = this.state.templates;


		switch (field){
			case "editable":
				templates.blocks[i].editable = !templates.blocks[i].editable;
				break;
			case "name":
				templates.blocks[i].name = evt.target.value;
				this.checkJsonTemplates();
				break;
			case "type":
				templates.blocks[i].type = evt.target.value;
				break;
			default:
				break;
		}
		
		this.setState({templates:templates});
	},
	_onChangeHtml:function(i,e){
		var templates = this.state.templates;
		templates.blocks[i].html = e;
		this.setState({templates:templates});
	},
	_tryEditor:function(i,type){
		var editorContainer = this.refs['editor'+i];
		if(editorContainer){
			var editor=editorContainer.editor;
			var text = editor.session.getTextRange(editor.getSelectionRange());			
			var range = editor.getSelectionRange();
			if(type=='foreach'){				
				text = "\n<? foreach($models as $model):?>\n\t"+text+"\n<? endforeach; ?>\n"
				editor.session.replace(range, text)
			}else if(type=='form'){
				text = "\n<?php $form = ActiveForm::begin(['id' => 'contact-form']); ?>\n\t"+text+"\n<?php ActiveForm::end(); ?>\n"
				editor.session.replace(range, text);
				editor.selection.clearSelection();
				editor.selection.moveCursorTo(0,0);
				range = editor.getSelectionRange();
				editor.session.replace(range, "<?php\n\nuse yii\\helpers\\Html;\nuse yii\\bootstrap\\ActiveForm;\nuse yii\\captcha\\Captcha;\n?>\n");

			}else if(type=='field'){
				text = "<?= $form->field($model, '"+text+"') ?>\n"
				editor.session.replace(range, text)
			}
		}
	},
	checkJsonTemplates:function(){
		var checkAll = true;
		var jsonTemplate = this.state.jsonTemplate;
		if(jsonTemplate!=undefined){
			var templates = this.state.templates.blocks;
			for(k in jsonTemplate.files){
				var added = function(){					
					for(i in templates){
						if (templates[i]["name"]==jsonTemplate.files[k]["template"]){
							return true;
						}
					}
					return false;
				}();
				jsonTemplate.files[k]["exists"] = added
				if(!added && jsonTemplate.files[k]["template"]!=undefined){
					checkAll = false;
				}
			}
		
			this.setState({
				jsonTemplate:jsonTemplate
			});
		}
		return checkAll;
	},
	_onSelectJsonTemplate:function(index){
		var jsonTemplates = this.state.jsonTemplates;
		var r = this.setState({
			jsonTemplate:jsonTemplates[index]
		});
		var t = this;
		setTimeout(function(){
			t.checkJsonTemplates();	
		},0)
		
	},
	_onChangeJsonTemplate: function(i,e) {
		var value = e.target.value;
		var jsonTemplate = this.state.jsonTemplate;
		jsonTemplate.required[i].value = value;
		console.log(i,value);
		this.setState({
			jsonTemplate:jsonTemplate
		});
	},
	_onGenerateJsonTemplate:function(){
		var jsonTemplate = this.state.jsonTemplate;
		var templates = this.state.templates;

		console.log("generate", jsonTemplate);
		var check = this.checkJsonTemplateCanGenerate();
		if(check.error===0){

			TemplateHelper.generateJsonTemplate(this.state.pathToProject,jsonTemplate,templates.blocks);
			bootbox.dialog({
				message: "Generator works fine!",
				title: "Success!",
				buttons: {
					success: {
					  label: "OK",
					  className: "btn-success"
					}
				}
			});
		}else{
			bootbox.dialog({
				message: check.message,
				title: "Error",
				buttons: {
					success: {
					  label: "OK",
					  className: "btn-danger"
					}
				}
			});
		}
	},
	checkJsonTemplateCanGenerate:function(){
		var r  = {
			error:0,
			message:"No errors"
		};
		if(this.checkJsonTemplates()===false){
			r.error=1;
			r.message = "No templates in generator!";	
		}
		
		return r;
	},
	render: function() {
		var t = this;
		return (
			<div>
				<div className="row">
                    <div className="col-lg-12 heading">
                        <h1 className="page-header"><i className="ec-file"></i> Frontend (<b>{this.state.pathToProject}</b>) <Link to="projects">change</Link> </h1>
                    </div>  
                </div>
                <form className="form-horizontal group-border hover-stripped" role="form">
	                <div className="row">
	                	<div className="col-lg-4 col-md-4">
	                		<label>Path to html folder</label>
	                		<input className="form-control"  value={this.state.path} readOnly/>

	            		</div>
	                	<div className="col-lg-4 col-md-4">	                		
	                		<label>Select html folder</label>	 
	                		<div className="input-group">
		                		<input type="file" onChange={this.onChangeFile} className="form-control" />						      
		                		<span className="input-group-btn">
		                			<button className="btn btn-dark"  onClick={this._onClickSet}> Set </button>
		                			<button className="btn btn-dark"  onClick={this._onClickAnalize}> Open </button>
		                		</span>
	                		</div>
	                	</div>
	                	<div className="col-lg-4 col-md-4">
	                		<label>Actions</label><br/>
                			<button className="btn btn-warning"  onClick={this._onMagic}><i className="fa-magic"></i> Make Magic! </button>
	                	</div>
	                </div>
                </form>
                <div className="row source-list">
                	<div className="col-lg-6 col-md-6">
                		<h4>JS List</h4>                		
                		<small>
            			{
	                    this.state.jsFiles.map(function(file){
	                        return (  
	                        	<span className="label label-brown">{file}</span>
	                        	)
		                    })
		                }               
	                {
                    this.state.jsInline.map(function(file){
                        return (  
                        	<pre className="well">{file}</pre>
                        	)
	                    })
	                }               
	                
	                </small> 	

                	</div>
                	<div className="col-lg-6 col-md-6">
	                	<h4>CSS List</h4>
	                	<small>
            			{
	                    this.state.cssFiles.map(function(file){
	                        return (  
	                        	<span className="label label-magenta">{file}</span>
	                        	)
		                    })
		                }
		                </small>		                
                	</div>
                	<div className="col-lg-12 col-md-12">
	                	<h4>Library</h4>
	            			{
		                    this.state.jsonTemplates.map(function(template,index){
		                        return (
		                        	<button type="button" className={(t.state.jsonTemplate!=undefined && template.name==t.state.jsonTemplate.name)?'btn btn-sm btn-success':'btn btn-sm btn-default'} onClick={t._onSelectJsonTemplate.bind(null,index)}>{template.name}</button>
	                        	)
		                    })
		                }
		                <hr/>
		                {
		                	this.state.jsonTemplate!=undefined?<TemplateForm template={this.state.jsonTemplate} onChange={this._onChangeJsonTemplate} onGenerate={this._onGenerateJsonTemplate}/>:''
		                }
	                </div>
                	<div className="col-lg-12 col-md-12">
	                	<h4>Templates</h4>
	            			{
//<button type="button" className="btn btn-xs btn-info" onClick={t._onApplyTemplate.bind(null,index)}><i className="fa-eye"></i> Preview template</button> &nbsp; 
// <button type="button" className="btn btn-xs btn-warning" onClick={t._onApplyTemplate.bind(null,index)}><i className="fa-ok"></i> Apply template</button>
		                    this.state.templates.blocks.map(function(template,index){
		                        return (
		                        	<div key={index}>
									    <div className="panel panel-default" >
			                                <div className="panel-heading">
			                                    <h4 className="panel-title">{template.type}: <span className="label label-dark">{template.name}</span></h4>
			                                    <div className="panel-heading-content pull-right text-right">	
		                                    		<button type="button" className="btn btn-sm btn-danger" onClick={t._onRemoveTemplate.bind(null,index)}><i className="im-remove"></i></button>
			                                    </div>			                                	
		                                	</div>
			                                <div className="panel-body">
			                                	<form className="form-inline">
			                                		<label>Title: </label>
		                                            <input type="text" className="search-query input-sm col-lg-12 form-control" value={template.name} onChange={t._onChangeTemplate.bind(null,index,'name')}/>
		                                          	<label>Type: </label>  
		                                        	<select className="form-control input-sm" name="template[{index}][type]" value={template.type} onChange={t._onChangeTemplate.bind(null,index,'type')}> 
			                                            <option value="widget">Widget</option>
			                                            <option value="setting">Setting</option>
			                                            <option value="view">View</option>
			                                        </select>
			                                        
		                                        </form>	
		                                        <button type="button" className="btn btn-xs btn-info" onClick={t._onChangeTemplate.bind(null,index,'editable')}><i className="im-code"></i> {template.editable?'Close':'Edit'} HTML</button>&nbsp;
					                        	{
					                        		template.editable?			                        			
					                        			<div className="btn-group"> 
					                        				<button type="button" className="btn btn-xs btn-default" onClick={t._tryEditor.bind(null,index,'foreach')}><i className="im-code"></i> Foreach</button>
					                        				<button type="button" className="btn btn-xs btn-default" onClick={t._tryEditor.bind(null,index,'form')}><i className="im-code"></i> Form</button>			
					                        				<button type="button" className="btn btn-xs btn-default" onClick={t._tryEditor.bind(null,index,'field')}><i className="im-code"></i> Field</button>			
					                        			</div>
				                        			:''
					                        	}
			                                    {template.editable?<AceEditor
												    mode="html"
												    theme="tomorrow"
												    height="250"
												    width="100%"
												    ref={'editor'+index}
												    onChange={t._onChangeHtml.bind(null,index)}
												    value={template.html}
												    name={template.type+'-'+template.name}
												    editorProps={{$blockScrolling: true}}/>:''}
			                                </div>
			                            </div>
		                        	</div>
		                        	)
			                    })
			                }

                	</div>
            	</div>
            	<div className="row">
                    <div className="col-md-12">
                        <pre className="well">{this.state.log}</pre>
                    </div>
                </div>
			</div>
		);

	}

});
global.Html = Html;
module.exports = Html;