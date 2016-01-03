var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Fields = require('./helpers/fields');
var TemplateHelper = require('./helpers/templateHelper');
// var addons = require('react-addons');
var moment = require('moment');
require('moment/locale/ru');

var Generate = React.createClass({
    getInitialState: function() {
        return {
            error:{},
            migrations:[],
            tables:[],
            log:'',
            pathToProject:localStorage.path||'/home/',
            title:'Новая таблица',
            tableName:'new_table',
            image:false,
            fields: [{
                'name':'id',
                'length':8,
                'type':'MEDIUMINT',
                'required':true,
                'primary':true,
                'index':true
            },{
                'name':'title',
                'length':255,
                'type':'VARCHAR',
                'required':true,
                'index':false
            },{
                'name':'url',
                'length':255,
                'type':'VARCHAR',
                'required':true,
                'index':true
            }],
            templates:loadTemplates()
        };
    },
    getDefaultProps: function() {
        return {
            types :[{"name":"INT"},{"name":"VARCHAR"},{"name":"TEXT"},{"name":"DATE"},{"name":"TINYINT"},{"name":"SMALLINT"},{"name":"MEDIUMINT"},{"name":"BIGINT"},{"name":"DECIMAL"},{"name":"FLOAT"},{"name":"DOUBLE"},{"name":"REAL"},{"name":"BOOLEAN"},{"name":"DATE"},{"name":"DATETIME"},{"name":"TIMESTAMP"},{"name":"TIME"},{"name":"YEAR"},{"name":"CHAR"},{"name":"TINYTEXT"},{"name":"MEDIUMTEXT"},{"name":"LONGTEXT"}]
        };
    },
    componentDidMount: function() {
        this.updateProjectPath(this.state.pathToProject);
        $('[data-toggle="tooltip"]').tooltip();
    },
    addField:function(fieldType){
        var type = 'VARCHAR',name='new_field',index=false,unsigned=false,length=null;
        if(fieldType=='time'){
            type = 'INT';
            length = 10;
            unsigned = true;
            name = '{{some}}_at';
        }else if(fieldType=='relation'){
            type = 'MEDIUMINT';
            length = 8;
            unsigned = true;
            name = 'parent_{{some}}_id';
            index = true;
        }else if(fieldType=='boolean'){
            type = 'TINYINT';
            length = 1;
            unsigned = true;
            name = 'status';
            index = true;
        }else if(fieldType=='int'){
            type = 'MEDIUMINT';
            length = 8;
            unsigned = true;
            name = 'status';
            index = true;
        }
        else if(fieldType=='text'){
            length = 255;
        }

        var fields = this.state.fields;

        if(fieldType=='meta'){
            fields.push({
                'name':'meta_title',
                'type':'VARCHAR',
                'length':255,
                'required':false
            });
            fields.push({
                'name':'meta_keywords',
                'type':'VARCHAR',
                'length':255,
                'required':false
            });
            fields.push({
                'name':'meta_description',
                'type':'VARCHAR',
                'length':255,
                'required':false
            });
        }else{
            fields.push({
                'name':name,
                'type':type,
                'index':index,
                'length':length,
                'unsigned':unsigned,
                'required':false
            });
        }

        this.setState({
            fields:fields
        });

        // this.printJson();
    },
    handleChange: function(field,index,value) {
        var fields = this.state.fields
        if(fields[index]!=undefined){
            fields[index][field] = value;
            this.setState({
                fields:fields
            })
        }
    },
    printJson:function(migration){
       var fields = this.state.fields;
       if(migration==1){
            return TemplateHelper.generateMigration(this.state.tableName, fields);
       }else{
            return TemplateHelper.generateJson(this.state.tableName, fields);
       }
    },
    checkMigration:function() {
        var migrations = this.state.migrations;
        for(var i in migrations){
            if('create_'+this.state.tableName==migrations[i].title){
                return true;
            }
        }
        return false;
    },
    deleteFieldsEvent : function(index){
        var fields = this.state.fields;
        fields.splice(index,1);
        this.setState({
            fields:fields
        });
    },
    moveFieldsEvent : function(direction, index){
        var fields = this.state.fields;
        var move = fields.splice(index,1);
        if(direction === 0){
            fields.splice(index-1,0,move[0]);
        }else{
            fields.splice(index+1,0,move[0]);
        }
        this.setState({
            fields:fields
        });
    },
    handleTableNameChange:function(event){
        this.setState({
            'tableName':event.target.value.toLowerCase().replace(/[^a-z_]/g,'')
        });
    },
    handleTitleChange:function(event){
        this.setState({
            'title':event.target.value
        });
    },
    handleImageChange:function(event){
        this.setState({
            'image':event.target.checked
        });
        console.log(this.state.image);
    },
    handlePathChange:function(event){
        var path = event.target.value.trim('/');
        this.updateProjectPath(path);
    },
    updateProjectPath:function(path){

        fs.stat(path+'/yii',function (err, stats) {
            if (err) {
                console.error(err)
                this.setState({
                    error:{
                        path:'Путь неверный.'
                    },
                    migrations:[],
                    tables:[]
                });
            }else{

               

                var migrations = [];
                files = fs.readdirSync(path+'/console/migrations')||[];
                for(var i in files){
                    var file = files[i];
                    var string = file.split('_');
                    var time = moment(string[0].substring(1)+'_'+string[1],'YYMMDD_HHmmss');
                    migrations.push({
                        time: time.format('D MMMM'),
                        title: file.replace('.php','').split('_').slice(2).join('_'),
                        file: file,
                    });
                }
                this.setState({
                    error:{},
                    migrations:migrations
                });

            }
        }.bind(this));

        localStorage.path = path;

        this.setState({
            'pathToProject':path
        });

    },
    extractMigration:function(){
        console.log(this.refs.migration.getDOMNode()[0].value);
    },
    saveAs:function(saveAs){
        if(saveAs==1){
            bootbox.prompt('Set template title', function(title) {
              if (title !== null) {
                this.saveTemplate(title);
              }
            }.bind(this));
        }else{
            this.saveTemplate(this.state.title);
        }
    },
    saveTemplate:function(title){
        var templates = loadTemplates();
        var insert = true;
        templates.map(function(t,i){
            if(t.title==title){
                templates[i] =  {
                    title:title,
                    tableName:this.state.tableName,
                    fields:this.state.fields
                };
                insert = false;
            }
        }.bind(this));
        if(insert === true){
            templates.push({
                title:title,
                tableName:this.state.tableName,
                fields:this.state.fields
            });
        }
        localStorage.templates = JSON.stringify(templates);
        this.setState({
            templates:templates
        });
        $.gritter.add({title: 'Saved'});
    },
    deleteTemplate:function(){
        var templates = this.state.templates;
        templates = templates.filter(function(template){
            return template.title!=this.state.title;
        }.bind(this));
        localStorage.templates = JSON.stringify(templates);
        this.setState({
            templates:templates
        });
        $.gritter.add({
            title: 'Deleted',
            close_icon: 'en-cross',
        });
    },

    loadTemplate:function(template){
        this.setState({
            title:template.title,
            tableName:template.tableName,
            fields:template.fields
        });
    },
    generateFiles:function(){
        $.gritter.add({title: 'Migration is created'});
        TemplateHelper.generateFiles(this.state.pathToProject, this.state.tableName,this.state.fields);
    },
    runCommands:function(){
        console.log('runCommands');
        $.gritter.add({title: 'Done'});
        this.setState({
            'log':TemplateHelper.runCommands(this.state.pathToProject, this.state.tableName, this.state.image)
        });
    },
    render: function() {
        var boundChange = this.handleChange;
        var deleteFieldsEvent = this.deleteFieldsEvent;
        var moveFieldsEvent = this.moveFieldsEvent;
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 heading">
                        <h1 className="page-header"><i className="ec-cog"></i> Generate (<b>{this.state.pathToProject}</b>)  <Link to="projects">change</Link></h1>
                    </div>

                </div>
                <div className="outlet">
                    <br/>
                    <form className="form-horizontal group-border hover-stripped" role="form">
                        <div className={this.state.error['path']?'form-group has-error':'form-group'}>
                            <div className="col-lg-4 col-md-4" >
                                <div className={this.state.migrations.length>0?'':'hidden'}>
                                    <div className="input-group">
                                        <select className="form-control" ref="migration">
                                            {
                                                this.state.migrations.map(function(migration){
                                                    return <option value={migration.file}>{migration.time} -> {migration.title}</option>
                                                }.bind(this))
                                            }
                                        </select>
                                        <div className="input-group-btn">
                                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="fa-cog"></i> <span className="caret"></span></button>
                                            <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                                <li><a onClick={this.extractMigration}>Извлечь</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <span className="help-block text-muted">Migration list</span>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <div className={this.state.tables.length>0?'':'hidden'}>
                                    <div className="input-group">
                                        <select className="form-control" ref="table">
                                            {
                                                this.state.tables.map(function(table){
                                                    return <option value={table}>{table}</option>
                                                }.bind(this))
                                            }
                                        </select>
                                        <div className="input-group-btn">
                                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="fa-cog"></i> <span className="caret"></span></button>
                                            <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                                <li><a href="#" onClick={this.extractMigration}>Extract</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <span className="help-block text-muted">Tables</span>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-lg-2 col-md-2 col-sm-12 control-label">Title</label>
                            <div className="col-lg-10 col-md-10">
                                <input value={this.state.title} onChange={this.handleTitleChange} className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-lg-2 col-md-2 col-sm-12 control-label">Table</label>
                            <div className="col-lg-10 col-md-10">
                                <input value={this.state.tableName} onChange={this.handleTableNameChange} className="form-control" />
                                <span className="help-block text-muted">Available symbols: a-z и _</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-lg-12 col-md-12">
                                <div className="btn-group">
                                    <button type="button" className="btn btn-success" onClick={this.addField.bind(null, 'text')}><i className="br-plus"></i> Add field</button>
                                    <button type="button" className="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                        <span className="caret"></span>&nbsp;
                                        <span className="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <ul className="dropdown-menu" role="menu">
                                        <li>
                                            <a onClick={this.addField.bind(null, 'text')}><i className="fa-file-alt"></i> Text</a>
                                            <a onClick={this.addField.bind(null, 'int')}><i className="im-numbered-list"></i> Number</a>
                                            <a onClick={this.addField.bind(null, 'boolean')}><i className="fa-check"></i> Status</a>
                                            <a onClick={this.addField.bind(null, 'relation')}><i className="im-link"></i> Foreign </a>
                                            <a onClick={this.addField.bind(null, 'time')}><i className="fa-time"></i> Timestamp</a>
                                            <a onClick={this.addField.bind(null, 'meta')}><i className="fa-align-justify"></i> META-field</a>
                                        </li>
                                    </ul>
                                </div>
                                &nbsp;&nbsp;
                                <span className="label label-info">Count: {this.state.fields.length}</span>

                                <div className="btn-group pull-right">
                                    <div className="btn-toolbar">
                                        <div className="btn-group pr10">
                                            <button type="button" className="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="im-download3"></i> Load template <span className="caret"></span></button>
                                            <ul className="dropdown-menu" role="menu">
                                                <li>
                                                    {
                                                        this.state.templates.map(function(template){
                                                            return <a onClick={this.loadTemplate.bind(null, template)}>{template.title}</a>
                                                        }.bind(this))
                                                    }
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="btn-group">
                                            <button className="btn btn-success" onClick={this.saveAs.bind(null,false)} type="button">Save</button>
                                            <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                <span className="caret"></span>&nbsp;
                                                <span className="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <ul className="dropdown-menu" role="menu">
                                                <li>
                                                    <a onClick={this.saveAs.bind(null,true)} type="button">Save as...</a>
                                                    <a onClick={this.deleteTemplate} type="button">Delete</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row pb10 pt10 ">
                            <div className="col-xs-3  text-center">
                                <label>Title</label>
                            </div>
                            <div className="col-xs-2 text-center">
                                <label>Type</label>
                            </div>
                            <div className="col-xs-1 text-center">
                                <label>Length</label>
                            </div>
                            <div className="col-xs-1 text-center">
                                <label>default</label>
                            </div>
                            <div className="col-xs-1 text-center">
                                <label>index</label>
                            </div>
                            <div className="col-xs-1 text-center">
                                <label>unsigned</label>
                            </div>
                            <div className="col-xs-1 text-center">
                                <label>required</label>
                            </div>
                            <div className="col-xs-2 text-center">
                                <label>&nbsp;</label>
                            </div>
                        </div>
                        {
                            this.state.fields.map(function(field,i){
                                return (
                                    <div className="pb10">
                                        <Fields index={i} field={field} handleChange={boundChange} deleteFields={deleteFieldsEvent} moveFields={moveFieldsEvent}/>
                                    </div>
                                )
                            })
                        }
                        <hr/>
                        <div className="row prewels">
                            <div className="col-md-6">
                                <label>SQL</label>
                                <pre className="well">{this.printJson()}</pre>
                            </div>
                            <div className="col-md-6">
                                <label>Migration</label>
                                <pre className="well">{this.printJson(1)}</pre>
                            </div>
                        </div>
                        <div className={this.checkMigration()?'row':'row hidden'}>
                            <div className="col-md-12 ">
                                <div className="bs-callout bs-callout-warning fade in">
                                    <h4>Warning</h4>
                                    <p>Migration for this table been applied</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">

                            <div className="col-md-4 col-md-offset-4">
                                <button className={this.checkMigration()?'btn btn-warning disabled':'btn btn-warning'} type="button" onClick={this.generateFiles}
                                        data-toggle="tooltip" data-placement="top" title="Create migration in folder `console/migrations`">Generate migration <i className="en-database"></i></button>
                                &nbsp;
                                <button className="btn btn-success" type="button" onClick={this.runCommands} data-toggle="tooltip" data-placement="top" title="Start commands migrate/up, gii/model и gii/crud">Start <i className="im-rocket"></i></button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <pre className="well">{this.state.log}</pre>
                            </div>
                        </div>
                        <datalist id="types">
                            {
                                this.props.types.map(function(type){
                                    return <option value={type.name}/>
                                })
                            }
                        </datalist>
                    </form>
                </div>
            </div>
        );
    }
});




function loadTemplates(){
    var templates = JSON.parse(localStorage.templates||"[]");
    return templates;
}

module.exports = Generate;