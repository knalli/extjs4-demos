/*jslint continue: true */
Ext.define('App.view.Viewport', {
  extend: 'Ext.container.Viewport',
  requires : ['Ext.grid.Panel', 'Ext.data.Store', 'Ext.grid.plugin.BufferedRenderer', 'Ext.XTemplate'],
  layout: 'fit',

  initComponent: function () {
    var me = this;

    me.store = me.buildStore();
    me.items = me.buildItems();

    me.callParent(arguments);
  },

  buildStore : function(){
    return Ext.create('Ext.data.Store', {
      autoLoad : true,
      autoSave : false,
      buffered : true,
      pageSize : 50,
      remoteSort : true,
      remoteFilter : true,
      groupField: 'group',
      proxy : {
        type : 'ajax',
        simpleSortMode : false,
        url : 'grid.json',
        reader : {
            totalProperty : 'total',
            type : 'json',
            root : 'items'
        },
        writer : {
            type : 'json',
            allowSingle : false,
            root : 'items'
        }
      },
      fields : [ {
          name : 'id',
          type : 'int'
      }, {
          name : 'name',
          type : 'string'
      }, {
          name : 'group',
          type : 'string'
      } ],
      sorters : [ {
          property : 'id',
          direction : 'ASC'
      }]
    });
  },

  buildItems : function(){
    return [ {
      layout : 'fit',
      items : [ this.buildGrid() ],
      dockedItems : [{
        xtype : 'toolbar',
        items : [{
          xtype : 'button',
          text : 'Refresh',
          scope : this,
          handler : function() {
            this.store.load();
          }
        } ]
      }],
      bbar : ['->', {
        xtype : 'tbtext',
        itemId : 'displayItem',
        text : 'Loading...'
      }]
    }];
  },

  buildGrid : function(){
    return {
      xtype : 'grid',
      itemId : 'grid',
      selModel : {
        pruneRemoved : false,
        mode: 'MULTI'
      },
      features : [{
        ftype: 'grouping',
        groupHeaderTpl : 'Group: {group}'
      }],
      store : this.store,
      columns : [{
        xtype: 'rownumberer',
        width: 50
      }, {
        dataIndex : 'id',
        header : 'Id',
        width: 100
      }, {
        dataIndex : 'group',
        header : 'Group',
        width: 200,
      }, {
        dataIndex : 'name',
        header : 'Name',
        width: 400,
        flex : 1
      }]
    };
  }

});