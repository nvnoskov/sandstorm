
Generator  = {
    "widget":function(name){
        var s = function (){/*<?php
namespace frontend\widgets;
use Yii;
class [WIDGET_NAME] extends \yii\base\Widget
{
    public function run()
    {
        return $this->render("[WIDGET_NAME]",[]);
    }
}
?>
*/}.toString();
    return s.replace(/\[WIDGET_NAME\]/g,name).replace('function (){/*','').replace('*/}','');
    },
    'setting':function(data,path){
        createSettingInDb(data,path);
    }
}
function createSettingInDb(data,path){
    var child_process = require('child_process');
    var mysql      = require('mysql');

    child_process.exec(
      'php -r \'$config = include("'+path+'/common/config/main-local.php"); print json_encode($config, JSON_PRETTY_PRINT);\'',
      function (err, stdout, stderr) {
        console.log(stdout);
        var connectionConfig = JSON.parse(stdout).components.db;

        var dsn = connectionConfig.dsn.replace('mysql:','').split(';');
        var host = dsn[0].split('=')[1];
        var dbName = dsn[1].split('=')[1];
        var connection = mysql.createConnection({
          host     : '192.168.254.23',
          user     : 'root2',
          database : dbName,
          password : connectionConfig.password
          // host     : host,
          // user     : connectionConfig.username,
          // password : connectionConfig.password
        });
        var tables = [];
        connection.connect(function(err) {
          if (err) {
            console.error('error connecting: ' + err.stack);
            return;
          }

          var sqlString = 'SELECT `id` FROM setting WHERE name="'+data.name+'"';
          connection.query(sqlString, function(err, rows) {
            console.log(rows);
            if(rows!=null){
                var sqlString = 'UPDATE setting SET value="'+data.html.replace('"','\"')+'" WHERE name="'+data.name+'"';
            }else{
                var sqlString = 'INSERT INTO setting (title,name,type,lang,value) VALUES("'+data.name+'", "'+data.name+'","html","ru", "'+data.html.replace('"','\"')+'")';
            }
              console.log(sqlString);
              connection.query(sqlString, function(err, rows) {
                    console.log(err, rows);
              }.bind(this));

          }.bind(this));
        }.bind(this));
      }.bind(this)
    );
}
module.exports = Generator