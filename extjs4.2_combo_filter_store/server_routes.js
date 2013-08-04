module.exports = function (app) {
  app.get('/extjs4.2_combo_filter_store/combo.json', function (req, res) {
    res.json({
      successProperty: 'success',
      success: true,
      items: [{
        id: 1,
        name: 'Group 1'
      }, {
        id: 2,
        name: 'Group 2'
      }]
    });
  });
};