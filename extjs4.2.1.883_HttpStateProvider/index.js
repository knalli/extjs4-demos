Ext.application({

  name: 'App',
  autoCreateViewport: false,

  launch: function () {
    Ext.state.Manager.setProvider(new hlx.base.state.HttpProvider({
      storeSyncOnLoadEnabled : true,
      onFirstLoad: function () {
        Ext.create('App.view.Viewport');
      }
    }));
    console.info('Launched');
  }
});