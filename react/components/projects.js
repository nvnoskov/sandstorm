var React = require('react');
var Router = require('react-router');


var getFileAndFolders = function(){
    var p = localStorage.projectsDir||null;

    var filelist = filelist || [];
    if( p !== null){
        files = fs.readdirSync(p);
        files.forEach(function(file) {
            try{
                if (fs.statSync(p + file+'/yii').isFile()) {
                    filelist.push(file);
                }
            }catch(e){
                console.log(e);
            }
        });
    }
    return {
        files:filelist
    };
}

var Projects = React.createClass({
    mixins: [ Router.Navigation ],
    getInitialState: function() {
        var fileAndFolders = getFileAndFolders();
        if(fileAndFolders.files.length==0) {
            this.transitionTo('setting');
        }
        return fileAndFolders;
    },
    _onCreate:function(e){
        var t = this;
        var newproject = this.refs.newproject.getDOMNode().value;
        var logShell = $('#log-shell');
        logShell.fadeIn();
        if(newproject){
            logShell.append("DIR: "+localStorage.projectsDir+"\n");
            // var cmd = "cd "+localStorage.projectsDir+" && composer create-project --repository-url=http://packagist.vesna.kz --no-interaction vesna/yii2-main-template "+newproject+" dev-store";
            // logShell.append("CMD: "+cmd+"\n");
            // // var commandShell = spawn('ls',[localStorage.projectsDir]);
            // var commandShell = spawn('composer',[
            //     'create-project',
            //     '--repository-url=http://packagist.vesna.kz',
            //     '--no-interaction',
            //     '--ansi',
            //     'vesna/yii2-main-template',
            //     localStorage.projectsDir+"/"+newproject,
            //     'dev-store'
            // ]);
            // var stream = ansi({ chunked: false })
            //   , file = fs.createWriteStream('browserify.html', 'utf8')

            // commandShell.stdout.pipe(stream)
            // commandShell.stderr.pipe(stream)

            // stream.on('data', function(data) {
            //     logShell.append(data.toString("utf8"));
            //     logShell.scrollTop(logShell[0].scrollHeight);
            // });

            // commandShell.on('close', function (code) {
            //     logShell.append('child process exited with code ' + code);

            //     child_process.exec(localStorage.projectsDir+"/"+newproject+"/init --env=Development --overwrite=1",function(){
            //         t.setState(getFileAndFolders());
            //     });

            // });

            var cmd = "cd "+localStorage.projectsDir+" && composer create-project --repository-url=http://packagist.vesna.kz --no-interaction vesna/yii2-main-template "+newproject+" dev-store";
            var cmd2 = localStorage.projectsDir+"/"+newproject+"/init --env=Development --overwrite=1";
            var cmd3 = localStorage.projectsDir+"/"+newproject+"/yii setup";
            child_process.exec('gnome-terminal -x bash -c "'+cmd+'; '+cmd2+'; '+cmd3+'; read -n1 -p \\"Press any key then refresh projects list...\\""');

        }else{
            logShell.append("DIR: NO SELECT");
            // var newproject = 'testfromsandterm';
            // var cmd = "cd "+localStorage.projectsDir+" && composer create-project --repository-url=http://packagist.vesna.kz --no-interaction vesna/yii2-main-template "+newproject+" dev-store";
            // var cmd2 = localStorage.projectsDir+"/"+newproject+"/init --env=Development --overwrite=1";
            // child_process.exec('gnome-terminal -x bash -c "'+cmd+'; '+cmd2+'; read -n1 -p \\"Press any key then refresh projects list...\\""');

        }
    },
    _onClick:function(e){
        if(e.target.id){
            localStorage.path = localStorage.projectsDir+e.target.id+'/';
            this.transitionTo('generate');
        }
    },
    render: function() {
        var t = this;
        return (
            <div className="outlet">
                <hr/>
                <div className="row">
                {
                    this.state.files.map(function(file,index){
                        return (
                            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" key={index}>
                                <div className="tile gray-spr">
                                    <div className="tile-icon">
                                        <i className="im-folder-open s32"></i>
                                    </div>
                                    <div className="tile-content" >
                                        <div className="number countTo" data-from="0" data-to="13">13</div>
                                        <h3>{file} <button  onClick={t._onClick} id={file} className="btn btn-link btn-xs">Select</button></h3>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                </div>

                <pre id="log-shell">

                </pre>
            </div>

        );
    }

});

/*<div className="row">
      <div className="col-md-6 col-md-offset-3">
      <form className="form-inline">
            <label htmlFor="exampleInputName2">New project</label>
            <input type="text" ref="newproject"  className="form-control" placeholder="newproject"/>
            <button type="button" className="btn btn-success" onClick={this._onCreate}>Create</button>
        </form>
      </div>
</div>*/
module.exports = Projects;
