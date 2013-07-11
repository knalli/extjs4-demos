Ext.define('Patch.Ext.grid.plugin.BufferedRenderer', {
  override: 'Ext.grid.plugin.BufferedRenderer',

  init: function(grid) {
    this.callParent(arguments);
  },

  setBodyTop: function(){
    this.callParent(arguments);
    this.view.fireEvent('bufferRefreshed', this);
  }
});

Ext.define('App.plugin.RowExpander', {
  extend : 'Ext.ux.RowExpander',
  alias: 'plugin.rowexpander2',

  eventForModificationsInitialized : false,

  init: function(grid) {
    var me = this;
    me.callParent(arguments);

    grid.getStore().on('load', function() {
      console.debug('expander got load');
      me.refreshMarkup();
    }, {
      buffer : 150
    });

    grid.getStore().on('refresh', function() {
      console.debug('expander got refresh');
      me.refreshMarkup();
    }, {
      buffer : 150
    });

    grid.view.on({
      bufferRefreshed: {
        buffer: 200,
        fn: function(){
          me.refreshMarkup();
        }
      }
    });
  },

  refreshMarkup : function() {
    var me = this, id, store = null, grid = me.getCmp();

    // Avoid NPE ("no view" is possible if this was called before the component has actually finished rendering)
    if (!me.view) {
      return;
    }
    store = me.view.getStore();
    if (!store) {
      return;
    }

    var rowIdx, rowNode, nextBd, record;
    for (id in me.recordsExpanded) {
      if (me.recordsExpanded.hasOwnProperty(id)) {
        rowIdx = store.findBy(function(record){
          return (('' + record.get('id')) === id);
        });

        if (me.recordsExpanded[id] && rowIdx >= 0) {
          rowNode = me.view.getNode(rowIdx);
          if (!rowNode) {
            continue;
          }
          nextBd = Ext.fly(rowNode).down(me.rowBodyTrSelector);
          if (!nextBd) {
            continue;
          }
          record = me.view.getRecord(rowNode);
          if (!record) {
            continue;
          }

          me.recordsExpanded[record.internalId] = true;
          me.view.fireEvent('expandbody', rowNode, record, nextBd.dom);
        }
      }
    }

    if (!me.eventForModificationsInitialized) {
      me.view.on('expandbody', function(){
        grid.updateLayout({
          defer : true
        });
      });
      me.eventForModificationsInitialized = true;
    }
  }
});


Ext.define('App.view.Viewport', {
  extend: 'Ext.container.Viewport',
  requires : ['Ext.grid.Panel', 'Ext.data.Store', 'Ext.grid.plugin.BufferedRenderer', 'Ext.ux.RowExpander', 'Ext.XTemplate'],
  layout: 'fit',

  initComponent: function () {
    var me = this;

    me.store = me.buildStore();
    me.items = me.buildItems();

    me.callParent(arguments);

    me.on('afterrender', function(){
      me.store.loadPage(1);
    });

    me.store.on('load', function(){
      me.queryById('displayItem').setText(me.store.getTotalCount() + ' items');
    });

    me.queryById('grid').getView().on('expandbody', me.prepareImageMarkup, me);
  },

  buildStore : function(){
    return Ext.create('Ext.data.Store', {
      autoLoad : false,
      autoSave : false,
      buffered : false,
      pageSize : 500,
      remoteSort : false,
      remoteFilter : false,
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
          name : 'description',
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
        }]
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
        pruneRemoved : false
      },
      plugins : [{
        pluginId : 'expander',
        ptype : 'rowexpander2',
        expandOnDblClick : true,
        selectRowOnExpand : true,
        rowBodyTpl : Ext.create('Ext.XTemplate', this.buildImageTpl(), {
          prefixUrl : 'x'
        })
      }, {
        ptype: 'bufferedrenderer'
      }],
      store : this.store,
      columns : [{
        dataIndex : 'id',
        header : 'Id',
        width: 100
      }, {
        dataIndex : 'description',
        header : 'Description',
        width: 400,
        flex : 1
      }, {
        dataIndex : 'name',
        header : 'Name',
        width: 200
      }, {
        dataIndex : 'name',
        header : 'Name',
        width: 200
      } ]
    };
  },

  buildImageTpl : function(){
    return '<div class="xdemo-img-holder"><div class="image" pre-src="static_image.png"></div></div><div class="xdemo-img-holder"><div class="image" pre-src="static_image.png"></div></div><div class="xdemo-img-holder"><div class="image" pre-src="static_image.png"></div></div>';
  },

  prepareImageMarkup : function(expander, record, el) {
    var me = this;
    var imgs = Ext.fly(el).query('.xdemo-img-holder .image');
    for (var i = 0, c = imgs.length; i < c; i++) {
      var img = imgs[i];
      var imagePath = img.getAttribute('pre-src');
      Ext.get(img).applyStyles({
        background: 'url(' + imagePath + ') 0 0 no-repeat'
      });
    }
    console.debug('Re-write HTML for ' + imgs.length + ' elements.');

    setTimeout(function(){
      me.queryById('grid').doComponentLayout();
    }, 0);
  }

});