Ext.define('Employee', {
  extend: 'Ext.data.Model',
  fields: [
    {
      name: 'rating',
      type: 'int'
    },
    {
      name: 'salary',
      type: 'float'
    },
    {
      name: 'name'
    }
  ]
});
// from docs.sencha.com
function createFakeData(count) {
  var firstNames = ['Ed', 'Tommy', 'Aaron', 'Abe', 'Jamie', 'Adam', 'Dave', 'David', 'Jay', 'Nicolas', 'Nige'], lastNames = ['Spencer', 'Maintz', 'Conran', 'Elias', 'Avins', 'Mishcon', 'Kaneda', 'Davis', 'Robinson', 'Ferrero', 'White'], ratings = [1, 2, 3, 4, 5], salaries = [100, 400, 900, 1500, 1000000];

  var data = [], i;
  for (i = 0; i < (count || 25); i++) {
    var ratingId = Math.floor(Math.random() * ratings.length), salaryId = Math.floor(Math.random() * salaries.length), firstNameId = Math.floor(Math.random() * firstNames.length), lastNameId = Math.floor(Math.random() * lastNames.length),

      rating = ratings[ratingId], salary = salaries[salaryId], name = Ext.String.format("{0} {1}", firstNames[firstNameId], lastNames[lastNameId]);

    data.push({
      rating: rating,
      salary: salary,
      name: name
    });
  }
  return data;
}

// Create the Data Store.
// Because it is buffered, the automatic load will be directed
// through the prefetch mechanism, and be read through the page cache
var store = Ext.create('Ext.data.Store', {
  id: 'store',
  buffered: true,
  // Configure the store with a single page of records which will be cached
  pageSize: 1000,
  data: createFakeData(1000),
  groupField: 'salary',
  model: 'Employee',
  proxy: {
    type: 'memory'
  }
});
Ext.define('MyApp.view.Viewport', {
  extend: 'Ext.container.Viewport',
  layout: 'fit',

  initComponent: function () {

    this.items = [
      {
        xtype: 'tabpanel',
        items: [
          {
            title: 'Tab 1',
            xtype: 'panel',
            layout: 'border',
            items: [
              {
                region: 'center',
                features: [
                  {
                    ftype: 'grouping'
                  }
                ],
                xtype: 'gridpanel',
                store: store,
                selModel: {
                  pruneRemoved: false
                },
                viewConfig: {
                  trackOver: false
                },
                columns: [
                  {
                    xtype: 'rownumberer',
                    width: 40,
                    sortable: false
                  },
                  {
                    text: 'Name',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name'
                  },
                  {
                    text: 'Rating',
                    width: 125,
                    sortable: true,
                    dataIndex: 'rating'
                  },
                  {
                    text: 'Salary',
                    width: 125,
                    sortable: true,
                    dataIndex: 'salary',
                    align: 'right',
                    renderer: Ext.util.Format.usMoney
                  }
                ]
              },
              {
                region: 'south',
                height: 200,
                split: true,
                xtype: 'tabpanel',
                items: [
                  {
                    title: 'A',
                    html: 'A'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
    this.callParent();
  }
});

Ext.application({
  name: 'MyApp',
  autoCreateViewport: true,
  launch: function() {
  }
});