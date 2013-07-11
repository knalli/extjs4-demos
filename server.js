// based on http://thecodinghumanist.com/blog/archives/2011/5/6/serving-static-files-from-node-js

var http = require('http');
var fs = require('fs');
var path = require('path');

var loremIpsum = require('lorem-ipsum');
var open = require('open');

var extractUrlParameter = function(string, paramName) {
  var result = string.match(new RegExp(".*\\?.*" + paramName + "=(\\d+).*"));
  if (result && result.length) {
    return result[1];
  }
};

var reduceDataset = function(rows, url) {
  var offset = parseInt(extractUrlParameter(url, 'start'), 10) || 0;
  var limit = parseInt(extractUrlParameter(url, 'limit'), 10) || -1;
  
  var start = offset, end = rows.length;

  if (limit) {
    end = start + limit;
  }

  console.log("start=" + start + " end=" + end);

  return rows.slice(start, end);
};

http.createServer(function (request, response) {

  console.log('request starting...');

  var url = request.url;

  (function(){
    // extjs4.2_combo_filter_store
    var module = '/extjs4.2_combo_filter_store/combo.json';
    if (url.substring(0, module.length) == module) {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.write(JSON.stringify({successProperty: 'success', success: true, items: [{id: 1, name: 'Group 1'}, {id: 2, name: 'Group 2'}]}));
      response.end();
      return;
    }
  }());

  (function(){
    // extjs4.1.883_RowExpander + Paging
    var module = '/extjs4.2.1.883_RowExpander/grid.json';
    if (url.substring(0, module.length) == module) {
      response.writeHead(200, {'Content-Type': 'application/json'});
      var rows = [], count = 1000;
      for (var i = 1; i <= count; i++) {
        rows.push({
          id : i,
          name : "Item " + i
        });
      }
      response.write(JSON.stringify({
        successProperty: 'success',
        success: true,
        items: reduceDataset(rows, request.url),
        total : rows.length
      }));
      response.end();
      return;
    }
  }());

  (function(){
    // extjs4.1.883_RowExpander + Paging
    var module = '/extjs4.2.1.883_RowExpander2/grid.json';
    if (url.substring(0, module.length) == module) {
      response.writeHead(200, {'Content-Type': 'application/json'});
      var rows = [], count = 1000;
      for (var i = 1; i <= count; i++) {
        rows.push({
          id : i,
          name : "Item " + i,
          description : loremIpsum({units: 'words', count: 10, format: 'plain'})
        });
      }
      response.write(JSON.stringify({
        successProperty: 'success',
        success: true,
        items: reduceDataset(rows, request.url),
        total : rows.length
      }));
      response.end();
      return;
    }
  }());

  (function(){
    // extjs4.2.1.883_MultiSelection
    var module = '/extjs4.2.1.883_MultiSelection/grid.json';
    if (url.substring(0, module.length) == module) {
      response.writeHead(200, {'Content-Type': 'application/json'});
      var rows = [], count = 1000;
      for (var i = 1; i <= count; i++) {
        rows.push({
          id : i,
          name : "Item " + i
        });
      }
      response.write(JSON.stringify({
        successProperty: 'success',
        success: true, 
        items: reduceDataset(rows, request.url),
        total : rows.length
      }));
      response.end();
      return;
    }
  }());

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
open("http://localhost:8125");