### Sandstorm
![Sandstorm](/assets/img/sandstorm-40.png)

This application written on NodeWebkit with ReactJS.

**It works only with Yii2 advanced templates** (I\`ll fix this)

### Dependencies
NodeWebkit - [http://nwjs.io/](http://nwjs.io/)


### Features

* Create table structure in phpmyadmin\`s style
* Generate migration for Yii2
* Run command (migrate/up, gii/model, gii/crud) in project folder
* Create projects from sandstorm (in develop)
* Set html templates and assets to project (in develop)
* Apply html-templates to views in controllers (in develop)


### Install and run

```
git clone git@github.com:vesnateam/sandstorm.git
cd sandstorm
npm install
nw ./
```
First of all you need set `Path to projects` in settings section.
It path to your yii2 projects directory (app find `yii` executables in this folder).

Next select you project in `Projects` section.

And build you own sandcastles!

### Develop
```
git clone git@github.com:vesnateam/sandstorm.git
cd sandstorm
npm install
npm start & nw ./
```
watchify command (watchify react/app.js -o react/bundle.js -v) transform react source code to bundle.js

You can set `"toolbar": false` in `package.json` and rerun application for work with DevTools.


### Demo
![Create tables](/assets/img/demo.gif)
