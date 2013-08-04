// based on http://thecodinghumanist.com/blog/archives/2011/5/6/serving-static-files-from-node-js

var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();
app.configure(function () {
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.errorHandler());
  app.use(express.static(__dirname));
  app.use(app.router);
  require('./server_routes')(app);
});
var server = require('http').createServer(app);
server.listen(8125);

console.log('Server running at http://127.0.0.1:8125/');