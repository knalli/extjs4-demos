global.extractUrlParameter = function(string, paramName) {
  var result = string.match(new RegExp(".*\\?.*" + paramName + "=(\\d+).*"));
  if (result && result.length) {
    return result[1];
  }
};

global.reduceDataset = function(rows, url) {
  var offset = parseInt(extractUrlParameter(url, 'start'), 10) || 0;
  var limit = parseInt(extractUrlParameter(url, 'limit'), 10) || -1;

  var start = offset, end = rows.length;

  if (limit) {
    end = start + limit;
  }

  console.log("start=" + start + " end=" + end);

  return rows.slice(start, end);
};

module.exports = function (app) {
  require('./extjs4.2_combo_filter_store/server_routes')(app);
  require('./extjs4.2.1.883_MultiSelection/server_routes')(app);
  require('./extjs4.2.1.883_RowExpander/server_routes')(app);
  require('./extjs4.2.1.883_RowExpander2/server_routes')(app);
  require('./extjs4.2.1.883_HttpStateProvider/server_routes')(app);
};