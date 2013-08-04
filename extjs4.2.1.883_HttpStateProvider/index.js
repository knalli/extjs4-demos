Ext.application({

  name: 'App',
  autoCreateViewport: false,

  requires : ['hlx.base.state.HttpProvider', 'Ext.util.Point'],

  launch: function () {
    Ext.state.Manager.setProvider(new hlx.base.state.HttpProvider({
      storeSyncOnLoadEnabled : true,
      onFirstLoad: function () {
        setTimeout(function(){
          Ext.create('App.view.Viewport');
        }, 0);
      }
    }));
    console.info('Launched');
  }
});