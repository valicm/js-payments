var localConfigUrl = './config.json';
var defaultConfigError = 'Default configuration has not been set !';
var okStatusNumber = 200;

function fetchDefaultConfig(ST) {
  fetch(localConfigUrl)
    .then(function(response) {
      if (response.status !== okStatusNumber) {
        return Promise.reject(defaultConfigError);
      }
      return response.json();
    })
    .then(function(data) {
      if (data) {
        configurationInit(ST, data);
      }
    });
}
