
var TemplateHelper = {
    generateJsonTemplate:function(pathToProject, jsonTemplate,templates){
        function findTemplate(name){
            for(var i in templates){
                if(templates[i].name==name){
                    return templates[i];
                }
            }
        }
        var vars = {};
        for(var i in jsonTemplate.required){
            vars[jsonTemplate.required[i]["name"]] =jsonTemplate.required[i]["value"];
        }
        if(jsonTemplate.type=="controllers"){
            // Generate controller and views
            for(var i in jsonTemplate.files){
                var content = '';
                var file = jsonTemplate.files[i];
                if(file["content"]!=undefined){

                    content = fs.readFileSync('templates/'+file["content"].replace('@','')).toString();
                }else if(file["template"]!=undefined){
                    content = findTemplate(file["template"])["html"];
                }
                // replace vars in generated content;
                for(var j in vars){
                    var regex = new RegExp(j, "g");
                    content = content.replace(regex,vars[j]);
                }
                console.log(content);
                if(file.type=="controller"){
                    fs.writeFileSync(pathToProject+'/frontend/controllers/'+vars["_MODEL_"]+'Controller.php', content);
                }else if(file.type=="view"){
                    var folderName = vars["_MODEL_"].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
                    try {                        
                        stats = fs.lstatSync(pathToProject+'/frontend/views/'+folderName);
                        if (!stats.isDirectory()) {
                            fs.mkdirSync(pathToProject+'/frontend/views/'+folderName);
                        }
                    }
                    catch (e) {
                        fs.mkdirSync(pathToProject+'/frontend/views/'+folderName);
                    }
                    fs.writeFileSync(pathToProject+'/frontend/views/'+folderName+'/'+file["template"].replace('controller.','')+'.php', content);
                }
            }
            // Generate views    

        }

        // 
        // log.push('Path to file: '+pathToProject+'/frontend/views/'+route[0]+'/'+route[1]+'.php');    
    },
    generateLayout:function(path){
        var htmlString = fs.readFileSync(path+'/index.html').toString()
        var parsedHTML = cheerio.load(htmlString);
        var templateString = `<?php
use frontend\\assets\\AppAsset;
use yii\\helpers\\Url;
use yii\\helpers\\Html;
AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body>
    <?php $this->beginBody() ?>
    [BODY]
    <?php $this->endBody() ?>
    </body>
</html>
<?php $this->endPage() ?>
`;
        return templateString.replace("[BODY]",parsedHTML('body').html());
    },
    generateAssets:function(jsFiles,cssFiles){
        var templateString = `<?php
namespace frontend\\assets;
use yii\\web\\AssetBundle;

class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        '[CSS]'
    ];
    public $js = [
        '[JS]'
    ];
    public $depends = [
    ];
    public $jsOptions = [
        'defer'=>true,
        'async'=>true
    ];
}?>`;
        // var template = [];
        // template.push("<?php\n\nuse yii\\db\\Schema;\nuse yii\\db\\Migration;\n");
        // template.push("class "+migrationName+" extends Migration"+"\n{\n\tpublic function up(){");
        return templateString.replace("[CSS]",cssFiles.join("',\n\t'")).replace("[JS]",jsFiles.join("',\n\t'"));
    },
    generateMigration:function(tableName, fields){
        var migrationName = 'm'+moment().format('YYMMDD_HHmmss')+'_create_'+tableName;
        var migration = [];
        var indexes = [];
        migration.push("<?php\n\nuse yii\\db\\Schema;\nuse yii\\db\\Migration;\n");
        migration.push("class "+migrationName+" extends Migration"+"\n{\n\tpublic function up(){");
        migration.push("\t\t$this->createTable('"+tableName+"', [");
        for(var i in fields){
            var title = '';
            fields[i].title = this.generateField(fields[i]);
            migration.push("\t\t\t"+"'"+fields[i].name+"' => \""+fields[i].title+"\",");
            if(fields[i]['index'] && fields[i]['name']!='id'){
                indexes.push(fields[i]['name'])
            }
        }
        migration.push("\t\t]);");
        //'$this->createIndex("index_'.implode('_',$indexFields).'", "'.$data['name'].'",["'.implode('", "',$indexFields).'"]);'
        if(indexes.length>0){
            migration.push("\t\t$this->createIndex('index_"+indexes.join('_')+"', '"+tableName+"', ['"+indexes.join("', '")+"']);");
        }
        migration.push("\t}\n\tpublic function down(){\n\t\t$this->dropTable('"+tableName+"');\n\t\treturn true;\n\t\}\n}");
        return migration.join("\n");
    },
    generateJson:function(tableName, fields){
        var json = 'CREATE TABLE IF NOT EXISTS `'+tableName+'` ('+"\n";
        for(var i in fields){
            var title = '';
            fields[i].title = this.generateField(fields[i]);
            json += "\t"+'`'+fields[i].name+'` '+fields[i].title+"\n";
        }
        json += ')';

        return json
    },
    generateField : function(field){
        var additional = '', title = '',unsigned = '';
        if(field.primary){
            additional = ' AUTO_INCREMENT PRIMARY KEY'; //PRIMARY KEY AUTO_INCREMENT
        }else{
            if(field.unsigned && field.type.indexOf('INT')!==-1){
                unsigned = 'UNSIGNED ';
            }
            // if(field.unsigned){
            //     additional = '';
            // }
            if(field.default){
                additional = " DEFAULT '"+field.default+"'";
            }
        }
        title = field.type+(field.length?'('+field.length+')':'')+' '+unsigned+(field.required?' NOT NULL':' DEFAULT NULL')+additional;
        return title;
    },
    generateFiles : function(pathToProject, tableName, fields){
        console.log(pathToProject, tableName, fields);
        var migrationFile = this.generateMigration(tableName,fields);
        var migrationName = 'm'+moment().format('YYMMDD_HHmmss')+'_create_'+tableName;

        console.log(fs.writeFileSync(pathToProject+'/console/migrations/'+migrationName+'.php', migrationFile));
        return 1;
    },
    runCommands:function (pathToProject, tableName, image) {
        console.log('runcommand');
        var moduleName = tableName.charAt(0).toUpperCase() + tableName.slice(1);

        var log = [];
        // apply migrations
        var cmd = pathToProject+"/yii migrate/up --interactive=0";
        log.push("CMD: "+cmd);
        log.push(child_process.execSync(cmd).toString('utf8'));

        if(localStorage.giiModel){
            // run model
            cmd = pathToProject+"/yii "+localStorage.giiModel+" --interactive=0 --tableName="+tableName+" --overwrite=1 --ns=common\\\\models --enableI18N=1 --generateLabelsFromComments=1 --modelClass="+moduleName+" ";
            log.push("CMD: "+cmd);
            log.push(child_process.execSync(cmd).toString('utf8'));
        }

        if(localStorage.giiCrud){
            // run crud
            cmd = pathToProject+"/yii "+localStorage.giiCrud+" --interactive=0 --modelClass=common\\\\models\\\\"+moduleName+" --searchModelClass=backend\\\\models\\\\"+moduleName+"Search --overwrite=1 --viewPath=@backend/views/"+tableName+" --enableI18N=1 --controllerClass=backend\\\\controllers\\\\"+moduleName+"Controller ";
            log.push("CMD: "+cmd);
            log.push(child_process.execSync(cmd).toString('utf8'));
        }
        return log.join("\n");

    }
}
module.exports = TemplateHelper;