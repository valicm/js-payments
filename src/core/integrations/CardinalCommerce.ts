import { environment } from '../../environments/environment';
import {
  IAuthorizePaymentResponse,
  IOnCardinalValidated,
  IThreeDInitResponse,
  IThreeDQueryResponse,
  ON_CARDINAL_VALIDATED_STATUS,
  PAYMENT_BRAND,
  PAYMENT_EVENTS
} from '../models/CardinalCommerce';
import DomMethods from '../shared/DomMethods';
import { IFormFieldState } from '../shared/FormFieldState';
import Language from '../shared/Language';
import MessageBus from '../shared/MessageBus';
import Notification from '../shared/Notification';
import Selectors from '../shared/Selectors';
import { StJwt } from '../shared/StJwt';
import { Translator } from '../shared/Translator';
import GoogleAnalytics from './GoogleAnalytics';

declare const Cardinal: any;

/**
 * Cardinal Commerce class:
 * Defines integration with Cardinal Commerce and flow of transaction with this supplier.
 */
export class CardinalCommerce {
  /**
   * Check if card is enrolled and non frictionless
   * @param response
   * @private
   */
  private static _isCardEnrolledAndNotFrictionless(response: IThreeDQueryResponse) {
    return response.enrolled === 'Y' && response.acsurl !== undefined;
  }

  public messageBus: MessageBus;
  private _cardinalCommerceJWT: string;
  private _cardinalCommerceCacheToken: string;
  private readonly _cachetoken: string;
  private readonly _livestatus: number = 0;
  private readonly _startOnLoad: boolean;
  private _jwt: string;
  private readonly _requestTypes: string[];
  private readonly _threedinit: string;
  private _notification: Notification;
  private _sdkAddress: string = environment.CARDINAL_COMMERCE.SONGBIRD_TEST_URL;
  private _called: boolean = false;

  constructor(
    startOnLoad: boolean,
    jwt: string,
    requestTypes: string[],
    livestatus?: number,
    cachetoken?: string,
    threedinit?: string
  ) {
    this._startOnLoad = startOnLoad;
    this._jwt = jwt;
    this._threedinit = threedinit;
    this._livestatus = livestatus;
    this._cachetoken = cachetoken ? cachetoken : '';
    this._requestTypes = requestTypes;
    this.messageBus = new MessageBus();
    this._notification = new Notification();
    this._setLiveStatus();
    this._onInit();
    this.messageBus.subscribe(MessageBus.EVENTS_PUBLIC.UPDATE_JWT, (data: { newJwt: string }) => {
      const { newJwt } = data;
      this._jwt = newJwt;
      this._onInit();
    });
  }

  /**
   * Handles continue action from Cardinal Commerce, retrieve overlay with iframe which target is on AcsUrl
   * and handles the rest of process.
   * Cardinal.continue(PAYMENT_BRAND, CONTINUE_DATA, ORDER_OBJECT, NEW_JWT)
   */
  protected _authenticateCard(responseObject: IThreeDQueryResponse) {
    Cardinal.continue(
      PAYMENT_BRAND,
      {
        AcsUrl: responseObject.acsurl,
        Payload: responseObject.threedpayload
      },
      {
        Cart: [],
        OrderDetails: { TransactionId: responseObject.acquirertransactionreference }
      },
      this._cardinalCommerceJWT
    );
  }

  protected _cardinalSetup() {
    Cardinal.setup(PAYMENT_EVENTS.INIT, {
      jwt: this._cardinalCommerceJWT
    });
  }

  /**
   * Initiate configuration of Cardinal Commerce
   * Initialize Cardinal Commerce mechanism with given JWT (by merchant).
   */
  protected _onCardinalLoad() {
    Cardinal.configure(environment.CARDINAL_COMMERCE.CONFIG);
    Cardinal.on(PAYMENT_EVENTS.SETUP_COMPLETE, () => {
      this._onCardinalSetupComplete();
      GoogleAnalytics.sendGaData('event', 'Cardinal', 'init', 'Cardinal Setup Completed');
    });

    Cardinal.on(PAYMENT_EVENTS.VALIDATED, (data: IOnCardinalValidated, jwt: string) => {
      this._onCardinalValidated(data, jwt);
      GoogleAnalytics.sendGaData('event', 'Cardinal', 'validate', 'Cardinal payment validated');
    });
    this._cardinalSetup();
  }

  /**
   * Method on successful initialization after calling Cardinal.setup() - Songbird.js has been successfully initialized.
   * CAUTION ! this will not be triggered if an error occurred during Cardinal.setup() call.
   * This includes a failed JWT authentication.
   */
  protected _onCardinalSetupComplete() {
    if (this._startOnLoad) {
      const pan = new StJwt(this._jwt).payload.pan as string;
      this._performBinDetection({ validity: true, value: pan });
      const submitFormEvent: IMessageBusEvent = {
        data: { dataInJwt: true, requestTypes: this._requestTypes },
        type: MessageBus.EVENTS_PUBLIC.SUBMIT_FORM
      };
      this.messageBus.publishFromParent(submitFormEvent, Selectors.CONTROL_FRAME_IFRAME);
    } else {
      const messageBusEvent: IMessageBusEvent = {
        type: MessageBus.EVENTS_PUBLIC.LOAD_CARDINAL
      };
      this.messageBus.subscribe(MessageBus.EVENTS_PUBLIC.BIN_PROCESS, this._performBinDetection);
      this.messageBus.publishFromParent(messageBusEvent, Selectors.CONTROL_FRAME_IFRAME);
    }
  }

  /**
   * Triggered when the transaction has been finished.
   */
  protected _onCardinalValidated(data: IOnCardinalValidated, jwt: string) {
    const { ActionCode, ErrorNumber, ErrorDescription } = data;
    const translator = new Translator(new StJwt(this._jwt).locale);
    let errorNum: any = ErrorNumber;
    if (errorNum !== undefined) {
      errorNum = errorNum.toString();
    }
    const responseData: IResponseData = {
      acquirerresponsecode: errorNum,
      acquirerresponsemessage: ErrorDescription,
      errorcode: '50003',
      errormessage: Language.translations.COMMUNICATION_ERROR_INVALID_RESPONSE
    };
    responseData.errormessage = translator.translate(responseData.errormessage);
    const notificationEvent: IMessageBusEvent = {
      data: responseData,
      type: MessageBus.EVENTS_PUBLIC.TRANSACTION_COMPLETE
    };

    if (ON_CARDINAL_VALIDATED_STATUS.includes(ActionCode)) {
      this._authorizePayment({ threedresponse: jwt });
    } else {
      const resetNotificationEvent: IMessageBusEvent = {
        type: MessageBus.EVENTS_PUBLIC.RESET_JWT
      };
      this.messageBus.publishFromParent(resetNotificationEvent, Selectors.CONTROL_FRAME_IFRAME);
      this.messageBus.publishToSelf(notificationEvent);
      this._notification.error(Language.translations.COMMUNICATION_ERROR_INVALID_RESPONSE, true);
    }
  }

  /**
   * Triggered when the card number bin value changes
   */
  protected _performBinDetection(bin: IFormFieldState) {
    return Cardinal.trigger(PAYMENT_EVENTS.BIN_PROCESS, bin);
  }

  /**
   * Inserts songbird.js and load script.
   */
  protected _threeDSetup() {
    if (!this._called) {
      DomMethods.insertScript('head', this._sdkAddress).addEventListener('load', () => {
        this._onCardinalLoad();
      });
    } else {
      this._cardinalSetup();
    }
    this._called = true;
  }

  /**
   * Authorize payment.
   * @param data
   * @private
   */
  private _authorizePayment(data?: IAuthorizePaymentResponse | object) {
    data = data || {};
    if (data) {
      // @ts-ignore
      data.cachetoken = this._cardinalCommerceCacheToken;
    }

    const messageBusEvent: IMessageBusEvent = {
      data,
      type: MessageBus.EVENTS_PUBLIC.PROCESS_PAYMENTS
    };
    this.messageBus.publishFromParent(messageBusEvent, Selectors.CONTROL_FRAME_IFRAME);
    GoogleAnalytics.sendGaData('event', 'Cardinal', 'auth', 'Cardinal auth completed');
  }

  /**
   * Init all subscription methods.
   * @private
   */
  private _initSubscriptions() {
    this.messageBus.subscribeOnParent(MessageBus.EVENTS_PUBLIC.LOAD_CONTROL_FRAME, () => {
      this._onLoadControlFrame();
    });
    this.messageBus.subscribeOnParent(MessageBus.EVENTS_PUBLIC.THREEDINIT, (data: IThreeDInitResponse) => {
      this._onThreeDInitEvent(data);
    });
    this.messageBus.subscribeOnParent(MessageBus.EVENTS_PUBLIC.BY_PASS_INIT, () => {
      this._onByPassJsInitEvent();
    });
    this.messageBus.subscribeOnParent(MessageBus.EVENTS_PUBLIC.THREEDQUERY, (data: any) => {
      this._onThreeDQueryEvent(data);
    });
  }

  /**
   * Publishes message bus set request types event
   */
  private _publishRequestTypesEvent(requestTypes: string[]) {
    const messageBusEvent: IMessageBusEvent = {
      data: { requestTypes },
      type: MessageBus.EVENTS_PUBLIC.SET_REQUEST_TYPES
    };
    document.getElementById(Selectors.CONTROL_FRAME_IFRAME).addEventListener('load', () => {
      this.messageBus.publishFromParent(messageBusEvent, Selectors.CONTROL_FRAME_IFRAME);
    });
  }

  /**
   * Call all subscription methods.
   * @private
   */
  private _onInit() {
    this._initSubscriptions();
    this._publishRequestTypesEvent(this._requestTypes);
  }

  /**
   * Call _threeDInitRequest().
   * @private
   */
  private _onLoadControlFrame() {
    if (this._cachetoken) {
      this._byPassInitRequest();
    } else {
      this._threeDInitRequest();
    }
  }

  private _onByPassJsInitEvent() {
    this._cardinalCommerceJWT = this._threedinit;
    this._cardinalCommerceCacheToken = this._cachetoken;
    this._threeDSetup();
  }

  /**
   * Overwrite threedinit and cachetoken fields; call _threeDSetup().
   * @param data
   * @private
   */
  private _onThreeDInitEvent(data: IThreeDInitResponse) {
    let cachetoken: string;
    let threedinit: string;
    if (data) {
      cachetoken = data.cachetoken;
      threedinit = data.threedinit;
    }
    this._cardinalCommerceJWT = threedinit;
    this._cardinalCommerceCacheToken = cachetoken;
    this._threeDSetup();
  }

  /**
   * Call _threeDQueryRequest().
   * @param data
   * @private
   */
  private _onThreeDQueryEvent(data: IThreeDQueryResponse) {
    this._threeDQueryRequest(data);
  }

  private _byPassInitRequest() {
    const messageBusEvent: IMessageBusEvent = {
      data: this._cachetoken,
      type: MessageBus.EVENTS_PUBLIC.BY_PASS_INIT
    };
    this.messageBus.publishFromParent(messageBusEvent, Selectors.CONTROL_FRAME_IFRAME);
  }

  /**
   * Checks if we are processing live transactions or not
   * @private
   */
  private _setLiveStatus() {
    if (this._livestatus) {
      this._sdkAddress = environment.CARDINAL_COMMERCE.SONGBIRD_LIVE_URL;
    }
  }

  /**
   * Perform a THREEDINIT with ST in order to generate the Cardinal songbird JWT.
   * @private
   */
  private _threeDInitRequest() {
    const messageBusEvent: IMessageBusEvent = {
      type: MessageBus.EVENTS_PUBLIC.THREEDINIT
    };
    this.messageBus.publishFromParent(messageBusEvent, Selectors.CONTROL_FRAME_IFRAME);
  }

  /**
   * Authenticates card or authorize payment.
   * @param responseObject
   * @private
   */
  private _threeDQueryRequest(responseObject: IThreeDQueryResponse) {
    if (CardinalCommerce._isCardEnrolledAndNotFrictionless(responseObject)) {
      this._authenticateCard(responseObject);
      GoogleAnalytics.sendGaData('event', 'Cardinal', 'auth', 'Cardinal card authenticated');
    } else {
      this._authorizePayment();
    }
  }
}
