/*jslint continue: true */
Ext.define('App.plugin.PreserveSelection', {
    alias : 'plugin.preserveselection',
    extend : 'Ext.AbstractPlugin',

    lastSelectedRecordIds : null,
    lastSelectedRecordPositions : null,

    config : {
        autoSelectFirstRow : true
    },

    init : function(grid) {
        var me = this;

        me.grid = grid;
        me.view = grid.view;
        me.store = grid.store;
        me.initEvents();
        // me.mon(grid, 'reconfigure', me.onReconfigure, me);
        // me.onReconfigure();
    },

    initEvents : function() {
        var me = this;

        if (!me.store) {
            return;
        }

        var selModel = me.grid.getSelectionModel();

        me.store.on({
            load : {
                // buffer to avoid race conditions
                delay : 100,
                fn : function(store) {
                    var lastSelectedRecordIds = me.lastSelectedRecordIds;
                    var lastSelectedRecordPositions = me.lastSelectedRecordPositions;
                    if (lastSelectedRecordIds && lastSelectedRecordIds.length > 0) {
                        // get the new records
                        var records = [], recordIds = [], recordPositions = [], record, position, i;
                        for (i = 0; i < lastSelectedRecordIds.length; i++) {
                            record = me.grid.store.getById(lastSelectedRecordIds[i]);
                            position = lastSelectedRecordPositions[i];
                            if (!record || !(position >= 0)) {
                                continue;
                            }
                            records.push(record);
                            recordPositions.push(position);
                            recordIds.push(record.data.id);
                        }
                        if (recordPositions.length) {
                            try {
                                if (me.store.buffered && me.grid && me.grid.view && me.grid.view.bufferedRenderer) {
                                    //console.debug('Scroll to position...');
                                    me.grid.view.bufferedRenderer.scrollTo(recordPositions[0], true, function(recordIdx, record) {
                                        // Fake selection start.
                                        if (me.grid.fixEnabled) me.grid.getSelectionModel().selectWithEvent(record, {});
                                    });
                                } else {
                                    //console.debug('Selecting a set of records...');
                                    selModel.select(records);
                                    // Fake selection start.
                                    if (me.grid.fixEnabled) me.grid.getSelectionModel().selectWithEvent(record, {});
                                }
                            } catch (e1) {
                                console.warn('Reselecting records failed. One or more ids are too old:', recordIds);
                            }
                        } else {
                            try {
                                //console.debug('No positions, selecting first row...');
                                selModel.select(me.store.getAt(0));
                                // Fake selection start.
                                if (me.grid.fixEnabled) me.grid.getSelectionModel().selectWithEvent(me.store.getAt(0), {});
                            } catch (e2) {
                                console.debug('Autoselect skipped because store is empty.');
                            }
                        }
                        // Anyway: Refresh selection cache.
                        me.lastSelectedRecordIds = recordIds;
                        me.lastSelectedRecordPositions = recordPositions;
                    } else if (me.autoSelectFirstRow && store.count() > 0) {
                        // try to select the first row
                        try {
                            //console.debug('First time, selecting first row...');
                            selModel.select(me.store.getAt(0));
                            // Fake selection start.
                            if (me.grid.fixEnabled) me.grid.getSelectionModel().selectWithEvent(me.store.getAt(0), {});
                        } catch (e3) {
                            console.debug('Autoselect skipped because store is empty.');
                        }
                    }
                }
            }
        });

        selModel.on('selectionchange', function(model, selected) {
            var selectedIds = [], selectedPositions = [], i;
            if (selected.length) {
                for (i = 0; i < selected.length; i++) {
                    if (selected[i].data.id) {
                        selectedIds.push(selected[i].data.id);
                        selectedPositions.push(me.grid.store.indexOf(selected[i]));
                    }
                }
                me.lastSelectedRecordIds = selectedIds;
                me.lastSelectedRecordPositions = selectedPositions;
            }
        });
    },

    onReconfigure : function() {
    }
});


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
        }, {
          xtype: 'button',
          text: 'Use "selectWithEvent"',
          enableToggle: true,
          pressed: false,
          toggleHandler: function(button, state){
            button.up('panel').down('grid').fixEnabled = state;
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
      plugins: [{
        ptype: 'preserveselection'
      }],
      selModel : {
        pruneRemoved : false,
        mode: 'MULTI'
      },
      store : this.store,
      columns : [{
        xtype: 'rownumberer',
        width: 50
      }, {
        dataIndex : 'id',
        header : 'Id',
        width: 100
      }, {
        dataIndex : 'name',
        header : 'Name',
        width: 400,
        flex : 1
      }]
    };
  }

});