function configurationInit(ST, data) {
  var stConfig = data;
  var parsedUrl = new URL(window.location.href);
  stConfig.jwt = parsedUrl.searchParams.get('jwt') || stConfig.jwt;

  stConfig.submitCallback = function(data) {
    console.error('This is what we have got after submit' + JSON.stringify(data));
  };

  stConfig.successCallback = function() {
    displayPopup('success-popup', 'This is success message', 'green');
  };

  stConfig.errorCallback = function() {
    displayPopup('error-popup', 'This is error message', 'red');
  };

  stConfig.cancelCallback = function() {
    displayPopup('cancel-popup', 'This is cancel message', '#ffc23a');
  };

  var st = ST(stConfig);

  st.Components(stConfig.components);
  st.VisaCheckout(stConfig.visaCheckout);
  st.ApplePay(stConfig.applePay);

  st.Cybertonica().then(function(response) {
    console.error(response);
  });
}
