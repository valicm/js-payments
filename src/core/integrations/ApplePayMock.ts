import { environment } from '../../environments/environment';
import { applePayButton } from '../imports/images';
import { NotificationType } from '../models/NotificationEvent';
import Language from '../shared/Language';
import ApplePay from './ApplePay';
import DomMethods from '../shared/DomMethods';

/**
 * Mocked version of Apple Pay setting test environment for Apple Pay automated tests.
 */
class ApplePayMock extends ApplePay {
  public paymentDetails: string;

  public paymentDetailsError: {
    errorcode: '3000';
    errormessage: 'Invalid field';
    requestid: 'J-3bhw30gu';
    requesttypedescription: 'WALLETVERIFY';
    transactionstartedtimestamp: '2019-04-18 12:11:26';
    walletsession: '';
    walletsource: 'APPLEPAY';
  };

  constructor(config: any, jwt: string) {
    super(config, jwt);
    this._onMockInit();
  }

  /**
   * Starts mocked Apple Pay flow
   * @private
   */
  private _onMockInit() {
    this._attachMockButton();
    this._setActionOnMockedButton();
  }

  /**
   * Attach created Apple Pay button into DOM
   */
  private _attachMockButton = () => DomMethods.appendChildIntoDOM(this.placement, this._createMockedButton());

  /**
   * Creates Apple Pay button element created from base64 image
   * @private
   */
  private _createMockedButton = () =>
    DomMethods.createHtmlElement.apply(this, [{ src: applePayButton, id: 'st-apple-pay-mock' }, 'img']);

  /**
   * Sets action on appended mocked Visa Checkout button
   * @private
   */
  private _setActionOnMockedButton() {
    DomMethods.addListener('st-apple-pay-mock', 'click', () => {
      this._getWalletverifyData()
        .then((data: any) => {
          this.paymentDetails = JSON.stringify(data);
          this._proceedFlowWithMockedData();
        })
        .catch(() => {
          this.setNotification(NotificationType.Error, 'error');
        });
    });
  }

  /**
   * Retrieves Apple Pay data from test endpoint
   * @private
   */

  private _getWalletverifyData() {
    return fetch(environment.APPLE_PAY_URLS.MOCK_DATA_URL)
      .then((response: any) => {
        return response.json();
      })
      .then((data: any) => {
        return data;
      });
  }

  /**
   * Proceeds payment flow with mocked data
   * @private
   */
  private _proceedFlowWithMockedData() {
    // @ts-ignore
    if (this.paymentDetails.walletsession) {
      this.onValidateMerchantResponseSuccess(this.paymentDetails);
      this.setNotification(NotificationType.Success, 'response');
      this._mockedPaymentAuthorization();
    } else {
      // @ts-ignore
      const { errorcode, errormessage } = this.paymentDetails;
      this.onValidateMerchantResponseFailure(this.paymentDetails);
      this.setNotification(NotificationType.Error, `${errorcode}: ${errormessage}`);
    }
  }

  /**
   * Mocked AUTH process after this.session.completePayment()
   * @private
   */
  private _mockedPaymentAuthorization() {
    this.stTransportInstance
      .sendRequest({
        requesttypedescription: 'AUTH',
        ...this.paymentRequest,
        wallettoken: this.merchantSession,
        walletsource: this.validateMerchantRequestData.walletsource,
        walletmerchantid: this.validateMerchantRequestData.walletmerchantid,
        walletvalidationurl: this.validateMerchantRequestData.walletvalidationurl,
        walletrequestdomain: this.validateMerchantRequestData.walletrequestdomain
      })
      .then(() => {
        this.setNotification(NotificationType.Success, Language.translations.PAYMENT_AUTHORIZED);
      })
      .catch(() => {
        this.setNotification(NotificationType.Error, Language.translations.PAYMENT_ERROR);
      });
  }
}

export default ApplePayMock;
