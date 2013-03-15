Ext.define('App.view.Viewport', {
  extend: 'Ext.container.Viewport',
  requires : ['App.view.Combo'],
  layout: 'fit',

  initComponent: function () {

    var store = new Ext.data.Store({
      totalProperty : 'total',
      autoLoad : false,
      autoSave : false,
      proxy : {
        type : 'ajax',
        simpleSortMode : false,
        url : 'combo.json',
        reader : {
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
      } ],
      sorters : [ {
          property : 'name',
          direction : 'ASC'
      }]
    });

    this.items = [{
      html : 'Panel',
      dockedItems : [{
        xtype : 'toolbar',
        items : [{
          xtype : 'hlx-common-combo',
          queryMode : 'local',
          name : 'hostGroup',
          itemId : 'hostGroup',
          valueField : 'id',
          displayField : 'name',
          fieldLabel : '',
          store : store,
          width : 100,
          showAllEnabled : true,
          nothingSelectedText : 'All Groups',
          listeners : {
              scope : this,
              change : this.onGroupSelect
          }
        }]
      }]
    }];

    this.callParent(arguments);

    this.on('afterrender', function(){
      store.load();
    }, this);
  },

  onGroupSelect : function(){
    console.info('GROUP SELECTED');
  }
});