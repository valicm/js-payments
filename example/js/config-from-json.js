(function() {

  var ST = SecureTrading;
  var remoteConfigUrl = '/config.json';
  var remoteError = 'Configuration has not been set !';
  var okStatusNumber = 200;

  window
    .fetch(remoteConfigUrl)
    .then(function(response) {
      if (response.status !== okStatusNumber) {
        return Promise.reject(remoteError);
      }
      return response.json();
    })
    .then(function(data) {
      try {
        configurationInit(ST, data);
      } catch (e) {
        console.error(e);
      }
    })
    .catch(function() {
      fetchDefaultConfig(ST);
    });
})();
