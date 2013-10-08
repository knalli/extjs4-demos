module.exports = function (app) {
  app.get('/extjs4.2.2.1144_GroupGridView/grid.json', function (req, res) {
    var rows = [], count = 1000;
    for (var i = 1; i <= count; i++) {
      rows.push({
        id : i,
        name : "Item " + i,
        group : i % 10
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