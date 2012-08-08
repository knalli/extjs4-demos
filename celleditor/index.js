Ext.define('MyApp.view.Viewport', {
  extend: 'Ext.container.Viewport',
  layout: 'fit',

  initComponent: function () {
    var store = Ext.create('Ext.data.Store', {
      proxy: 'memory',
      fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'}
      ]
    });
    this.items = [
      {
        dockedItems: [
          {
            dock: 'top',
            xtype: 'toolbar',
            items: [
              {
                xtype: 'button',
                text: 'Add',
                handler: function (btn) {
                  var grid = btn.up('grid'), record = new grid.store.model({});
                  grid.editingPlugin.cancelEdit();
                  grid.store.add(record);
                  grid.editingPlugin.startEdit(record, grid.columns[0]);
                }
              }
            ]
          }
        ],
        xtype: 'grid',
        title: 'Grid',
        store: store,
        selModel: {
          selType: 'rowmodel'
        },
        plugins: [
          {
            ptype: 'cellediting',
            clickToEdit: 2
          }
        ],
        columns: [
          {
            header: 'ID',
            dataIndex: 'id',
            editor: {
              revertInvalid: false,
              regex: /^[A-Z]+$/,
              regexText: 'Only uppercase!',
              field: {
                xtype: 'textfield'
              }
            }
          },
          {
            header: 'Name',
            dataIndex: 'name',
            editor: {
              revertInvalid: false,
              field: {
                xtype: 'textfield'
              }
            }
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
  launch: function () {
  }
});