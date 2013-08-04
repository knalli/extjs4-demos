var cookiesBuilderFn = require('../server_cookies');

var prefix = '/extjs4.2.1.883_HttpStateProvider';

module.exports = function (app) {
  app.get(prefix + '/grid.json', function (req, res) {
    var rows = [], count = 1000;
    for (var i = 1; i <= count; i++) {
      rows.push({
        id : i,
        name : "Item " + i
      });
    }
    res.json({
      successProperty: 'success',
      success: true,
      items: reduceDataset(rows, req.url),
      total : rows.length
    });
  });

  cookiesBuilderFn(app, prefix);
};