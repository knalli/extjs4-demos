var loremIpsum = require('lorem-ipsum');

module.exports = function (app) {
  app.get('/extjs4.2.1.883_RowExpander2/grid.json', function (req, res) {
    var rows = [], count = 1000;
    for (var i = 1; i <= count; i++) {
      rows.push({
        id : i,
        name : "Item " + i,
        description : loremIpsum({units: 'words', count: 10, format: 'plain'})
      });
    }
    res.json({
      successProperty: 'success',
      success: true,
      items: reduceDataset(rows, req.url),
      total : rows.length
    });
  });
};