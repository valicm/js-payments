import CardinalCommerce from '../../../src/core/classes/CardinalCommerce';

// given
describe('Class CCIntegration', () => {
  let instance: any;
  let { jwt, validationData } = CardinalCommerceFixture();

  // when
  beforeEach(() => {
    document.body.innerHTML = `<input id='JWTContainer' value="${jwt}" />`;
    instance = new CardinalCommerce('somejwt', 'https://webservices.securetrading.net/jwt/');
  });

  // given
  describe('Method _threedeinitRequest', () => {
    // then
    let sendRequestSpy: any;
    let threedeinitRequest;
    beforeEach(() => {
      sendRequestSpy = jest.spyOn(instance, 'sendRequest');
      threedeinitRequest = instance._threedeinitRequest();
    });
  });

  // given
  describe('Method _setConfiguration', () => {
    // then
    it('should be called once', () => {});
  });

  // given
  describe('Method _onPaymentSetupComplete', () => {
    // then
    it('should be called once', () => {});
  });

  // given
  describe('Method _onPaymentValidation', () => {
    // then
    it('should be called once', () => {});
  });

  // given
  describe('Method _onSetup', () => {
    // then
    it('should be called once', () => {});
  });

  // given
  describe('Method _retrieveValidationData', () => {
    // then
    it('should be called once', () => {});
  });
});

function CardinalCommerceFixture() {
  const validationData: object = {
    ActionCode: 'ERROR',
    ErrorDescription: 'Invalid JWT. Error verifying and deserialize JWT.',
    ErrorNumber: 1020,
    Validated: false
  };
  const jwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1YzEyODg0NWMxMWI5MjIwZGMwNDZlOGUiLCJpYXQiOjE1NTE4NzM2MDAsImp0aSI6IjQ2LWU';

  return { jwt, validationData };
}