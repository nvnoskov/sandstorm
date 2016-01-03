var fs = require('fs');
var gui = require('nw.gui');
var path = require('path');
var cheerio = require('cheerio');
var child_process = require('child_process');
var spawn = child_process.spawn;
var ansi = require('ansi-html-stream')
var moment = require('moment');
require('moment/locale/ru');
require('dns');
var mysql      = require('mysql');
