Ext.define('App.view.Combo', {

    extend : 'Ext.form.ComboBox',
    alias : 'widget.hlx-common-combo',

    name : 'combo',
    valueField : 'id',
    displayField : 'name',
    queryMode : 'local',
    typeAhead : true,
    allowBlank : false,
    triggerAction : 'all',
    selectOnFocus : true,
    editable : true,

    showAllEnabled : false,
    nothingSelectedText : 'All',

    startValue : null,

    initComponent : function() {
        this.callParent(arguments);

        this.store.on('load', this.applyShowAllText, this);
        this.store.on('load', function() {
            if (this.startValue) {
                this.setValue(this.startValue, true);
            }
        }, this);
    },

    applyShowAllText : function() {
        if (this.store.getById(0)) {
            return;
        }
        this.store.insert(0, [ new this.store.model({
            id : 0,
            name : this.nothingSelectedText
        }, 0) ]);
        this.applyValue(0);
    },

    applyValue : function(valueFieldValue) {
        var record = this.store.getById(valueFieldValue);
        if (record) {
            this.setValue(record.data[this.valueField]);
        }
    }

});