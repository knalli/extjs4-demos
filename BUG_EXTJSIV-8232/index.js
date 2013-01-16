Ext.define('MyApp.model.MyTreeModel', {
  extend: 'Ext.data.Model',

  fields: [
    {
      name: 'text',
      type: 'string'
    },
    {
      name: 'description',
      type: 'string'
    },
    {
      name: 'type',
      type: 'string'
    },
    {
      name: 'iconCls',
      type: 'string'
    },
    {
      name: 'attributes',
      type: 'auto'
    }
  ],

  proxy: {
    type: 'ajax',
    url: 'tree.json'
  }
});

Ext.define('MyApp.view.MyTreePanel', {
  extend: 'Ext.tree.Panel',
  alias: 'widget.mytreepanel'
});

Ext.define('MyApp.view.Viewport', {
  extend: 'Ext.container.Viewport',
  layout: 'fit',

  initComponent: function () {

    var store = Ext.create('Ext.data.TreeStore', {
      model: 'MyApp.model.MyTreeModel',
      listeners : {
        scope : this,
        beforeappend : this.onBeforeAppendTreeNode
      }
    });
    store.load();

    this.items = {
      xtype: 'panel',
      title: 'Panel',
      html: 'Just a panel',
      dockedItems: [
        {
          dock: 'left',
          width: 200,
          xtype: 'mytreepanel',
          title: 'Tree',
          store: store,
          dockedItems: {
            dock: 'bottom',
            xtype: 'toolbar',
            items: {
              xtype: 'button',
              text: 'Refresh',
              handler: function () {
                this.up('treepanel').store.reload();
              }
            }
          }
        }
      ]
    };
    this.callParent();
  },

  onBeforeAppendTreeNode : function() {
    this.applyLocalizedNodeTexts.apply(this, arguments);
  },

  applyLocalizedNodeTexts : function(parent, node, ev) {
    console.info(arguments);
  }
});

Ext.application({

  name: 'MyApp',
  autoCreateViewport: true,

  launch: function () {
    console.info('Launched');
  }
});