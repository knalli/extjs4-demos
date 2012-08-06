// based on http://thecodinghumanist.com/blog/archives/2011/5/6/serving-static-files-from-node-js

var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {

  console.log('request starting...');

  var url = request.url;
  if (url.indexOf('?') !== -1) {
    url = url.substring(0, url.indexOf('?'));
  }

  var filePath = '.' + url;
  if (filePath == './')
    filePath = './index.html';

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }

  path.exists(filePath, function (exists) {

    if (exists) {
      fs.readFile(filePath, function (error, content) {
        if (error) {
          response.writeHead(500);
          response.end();
        } else {
          response.writeHead(200, { 'Content-Type': contentType });
          response.end(content, 'utf-8');
        }
      });
    } else {
      response.writeHead(404);
      response.end();
    }
  });

}).listen(8125);

console.log('Server running at http://127.0.0.1:8125/');