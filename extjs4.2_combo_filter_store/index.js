Ext.define('Ext.data.override.Store', {
    override: 'Ext.data.Store',
 
    filter: function(filters, value) {
        if (Ext.isString(filters)) {
            filters = {
                property: filters,
                value: value
            };
        }
 
        var me = this,
            decoded = me.decodeFilters(filters),
            i,
            doLocalSort = me.sorters.length && me.sortOnFilter && !me.remoteSort,
            length = decoded.length,
            allDisabled = true;
 
        // Merge new filters into current filter set.
        for (i = 0; i < length; i++) {
            me.filters.replace(decoded[i]);
        }
 
        // Check that we have some enabled filters before attempting to filter     
        for (i = 0, length = me.filters.items.length; i < length; i++) {
            if (!me.filters.items[i].disabled) {
                allDisabled = false;
                break;
            }
        }
        if (!allDisabled) {
            if (me.remoteFilter) {
                // So that prefetchPage does not consider the store to be fully loaded if the local count is equal to the total count
                delete me.totalCount;
 
                // For a buffered Store, we have to clear the prefetch cache because the dataset will change upon filtering.
                // Then we must prefetch the new page 1, and when that arrives, reload the visible part of the Store
                // via the guaranteedrange event
                if (me.buffered) {
                    me.data.clear();
                    me.loadPage(1);
                } else {
                    // Reset to the first page, the filter is likely to produce a smaller data set
                    me.currentPage = 1;
                    //the load function will pick up the new filters and request the filtered data from the proxy
                    me.load();
                }
            } else {
                /**
                * @property {Ext.util.MixedCollection} snapshot
                * A pristine (unfiltered) collection of the records in this store. This is used to reinstate
                * records when a filter is removed or changed
                */
                if (me.filters.getCount()) {
                    me.snapshot = me.snapshot || me.data.clone();
 
                    // Filter the unfiltered dataset using the filter set
                    me.data = me.snapshot.filter(me.filters.items);
 
                    // Groups will change when filters change
                    me.constructGroups();
 
                    if (doLocalSort) {
                        me.sort();
                    } else {
                        // fire datachanged event if it hasn't already been fired by doSort
                        me.fireEvent('datachanged', me);
                        me.fireEvent('refresh', me);
                    }
                }
            }
        }
        me.fireEvent('filterchange', me, me.filters.items);
    }
});

Ext.application({

  name: 'App',
  autoCreateViewport: true,

  launch: function () {
    console.info('Launched');
  }
});

window.mockDispatcher = function(){
  console.log("DISPATCHER: ", arguments);
};