Ext.define('MyApp.view.Viewport', {
  extend: 'Ext.container.Viewport',
  layout: 'fit',

  initComponent: function () {
    var data = [
      {id: 1, name: 'One'},
      {id: 2, name: 'Two'},
      {id: 3, name: 'Three'},
      {id: 4, name: 'Four'},
      {id: 5, name: 'Five'},
      {id: 6, name: 'Six'},
      {id: 7, name: 'Seven'},
      {id: 8, name: 'Eight'},
      {id: 9, name: 'Nine'}
    ];
    var pageSize = 10;
    // jsfiddle echo response
    var ajaxResponseAsString = Ext.JSON.encode({success: true, total: data.length, items: data});
    var store = Ext.create('Ext.data.Store', {
      autoLoad: true,
      pageSize: pageSize,
      proxy: {
        type: 'ajax',
        actionMethods: {read: 'POST'},
        noCache: false,
        reader: {type: 'json', root: 'items'},
        url: '/echo/json/',
        extraParams: {json: ajaxResponseAsString, delay: 2}
      },
      fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'}
      ]
    });
    this.items = [
      {
        dockedItems: [
          {
            dock: 'bottom',
            xtype: 'pagingtoolbar',
            store: store,
            pageSize: pageSize,
            plugins: [ Ext.create('Ext.ux.SlidingPager') ]
          }
        ],
        xtype: 'grid',
        title: 'Grid',
        store: store,
        columns: [
          {
            header: 'ID',
            dataIndex: 'id'
          },
          {
            header: 'Name',
            dataIndex: 'name'
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