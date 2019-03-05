const applePayConfig = {
  button: {
    color: 'red',
    containerId: 'applePayContainerId'
  }
};

const loggingConfiguration = { logging: { level: 'on' } };

const paymentConfig = {
  displayLoading: false,
  framework: 'bootstrap3',
  view: 'modal'
};
const paypalConfig = {
  button: {
    color: 'gold',
    containerId: 'MySpecificPayPalId',
    shape: 'rect',
    size: '44px',
    style: 'paypal'
  },
  enableShippingAddress: false,
  flow: 'checkout',
  intent: 'order',
  offerCredit: false,
  shippingAddressEditable: true
};
const visaCheckoutConfig = {
  button: {
    color: '',
    containerId: 'MySpecificVisaCheckoutId',
    height: '',
    locale: '',
    size: '',
    width: ''
  }
};

const mockDataFromBackend = {
  AcsUrl:
    'https://testcustomer34.cardinalcommerce.com/merchantacsfrontend/pareq.jsp?vaa=b&gold=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  Payload:
    'eNpVUU1zgjAQvedXOE7PJHxKnTUzVNvRqVK1eGhvTEwLo4AmINpf3wSh2tu+3X3Je28hSgTnk3fOKsEpLLiU8TfvpdtR/ysMWfBK5kVg74NpvZj5Y9KnsAzW/EjhxIVMi5yaBjEswB1E6gnBkjgvKcTs+DQLqWnZjusNfMBtA0HGxWxyN7hiBHmccRoVF7muJOAGIWBFlZfiQn2HAO4AgkrsaVKWBznEuK5ro1Q0UUmDFRkGrKcI8E3MstKVVB7P6ZZ+7ty3D/IyXzyfT6solKtNYkebnbP6CUaA9QaCbVxyahHTIx4xe6Y/dK2h4wBu+gjiTEuhD6ZrECWshQgO+qPgikxXj+47yk4lBM9Z56dDCPj5UORc7ag4/2rl4aZ8PNWhslJl9ThwPNfUkTawYacqF4sQu6GnTUhYU3B7MtxeV1X/rv4LkFCmLA=='
};

export {
  applePayConfig,
  loggingConfiguration,
  paymentConfig,
  paypalConfig,
  visaCheckoutConfig,
  mockDataFromBackend
};
