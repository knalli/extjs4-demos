

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