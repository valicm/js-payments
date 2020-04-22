import './../styles/notification.css';
import './../styles/_control-frame.css';
import JwtDecode from 'jwt-decode';
import 'location-origin';
import { debounce } from 'lodash';
import 'url-polyfill';
import 'whatwg-fetch';
import '../application/core/shared/OverrideDomain';
import { CardFrames } from './classes/CardFrames.class';
import { CommonFrames } from './classes/CommonFrames.class';
import { MerchantFields } from './classes/MerchantFields';
import { StCodec } from '../application/core/services/StCodec.class';
import { ApplePay } from '../application/core/integrations/ApplePay';
import { ApplePayMock } from '../application/core/integrations/ApplePayMock';
import { GoogleAnalytics } from '../application/core/integrations/GoogleAnalytics';
import { VisaCheckout } from '../application/core/integrations/VisaCheckout';
import { VisaCheckoutMock } from '../application/core/integrations/VisaCheckoutMock';
import { IApplePayConfig } from '../application/core/models/IApplePayConfig';
import { IComponentsConfig } from '../shared/model/config/IComponentsConfig';
import { IConfig } from '../shared/model/config/IConfig';
import { IStJwtObj } from '../application/core/models/IStJwtObj';
import { IVisaConfig } from '../application/core/models/IVisaConfig';
import { MessageBus } from '../application/core/shared/MessageBus';
import { Translator } from '../application/core/shared/Translator';
import { environment } from '../environments/environment';
import { Selectors } from '../application/core/shared/Selectors';
import { Service, Inject, Container } from 'typedi';
import { CONFIG } from '../application/core/dependency-injection/InjectionTokens';
import { ConfigService } from './config/ConfigService';
import { ISubmitEvent } from '../application/core/models/ISubmitEvent';
import { ISuccessEvent } from '../application/core/models/ISuccessEvent';
import { IErrorEvent } from '../application/core/models/IErrorEvent';
import { InterFrameCommunicator } from '../shared/services/message-bus/InterFrameCommunicator';
import { FramesHub } from '../shared/services/message-bus/FramesHub';
import { BrowserLocalStorage } from '../shared/services/storage/BrowserLocalStorage';
import { BrowserSessionStorage } from '../shared/services/storage/BrowserSessionStorage';
import { Notification } from '../application/core/shared/Notification';
import { ofType } from '../shared/services/message-bus/operators/ofType';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigProvider } from '../application/core/services/ConfigProvider';

@Service()
class ST {
  private static DEBOUNCE_JWT_VALUE: number = 900;
  private static JWT_NOT_SPECIFIED_MESSAGE: string = 'Jwt has not been specified';
  private static LOCALE_STORAGE: string = 'locale';
  private static MERCHANT_TRANSLATIONS_STORAGE: string = 'merchantTranslations';
  private static readonly MODAL_CONTROL_FRAME_CLASS = 'modal';
  private _cardFrames: CardFrames;
  private _commonFrames: CommonFrames;
  private _googleAnalytics: GoogleAnalytics;
  private _merchantFields: MerchantFields;
  private _translation: Translator;
  private _destroy$: Subject<void> = new Subject();

  set submitCallback(callback: (event: ISubmitEvent) => void) {
    if (callback) {
      this.on('submit', callback);
    } else {
      this.off('submit');
    }
  }

  set successCallback(callback: (event: ISuccessEvent) => void) {
    if (callback) {
      this.on('success', callback);
    } else {
      this.off('success');
    }
  }

  set errorCallback(callback: (event: IErrorEvent) => void) {
    if (callback) {
      this.on('error', callback);
    } else {
      this.off('error');
    }
  }

  constructor(
    @Inject(CONFIG) private _config: IConfig,
    private _configService: ConfigService,
    private _configProvider: ConfigProvider,
    private _communicator: InterFrameCommunicator,
    private _framesHub: FramesHub,
    private _storage: BrowserLocalStorage,
    private _sessionStorage: BrowserSessionStorage,
    private _messageBus: MessageBus,
    private _notification: Notification
  ) {
    this._googleAnalytics = new GoogleAnalytics();
    this._merchantFields = new MerchantFields();
    this.init();
  }

  public on(event: 'success' | 'error' | 'submit', callback: any) {
    const events = {
      success: MessageBus.EVENTS_PUBLIC.CALL_MERCHANT_SUCCESS_CALLBACK,
      error: MessageBus.EVENTS_PUBLIC.CALL_MERCHANT_ERROR_CALLBACK,
      submit: MessageBus.EVENTS_PUBLIC.CALL_MERCHANT_SUBMIT_CALLBACK
    };
    // @ts-ignore
    this._messageBus.pipe(ofType(events[event]), takeUntil(this._destroy$)).subscribe(callback);
  }

  public off(event: string) {
    // @ts-ignore
  }

  public Components(config: IComponentsConfig): void {
    this._framesHub.waitForFrame(Selectors.CONTROL_FRAME_IFRAME).subscribe(async controlFrame => {
      this._config = this._configService.update({
        ...this._config,
        components: {
          ...this._config.components,
          ...(config || {})
        }
      });
      this._commonFrames.requestTypes = this._config.components.requestTypes;
      await this._communicator.query({ type: MessageBus.EVENTS_PUBLIC.CONFIG_CHECK }, controlFrame);
      this.CardFrames(this._config);
      this._cardFrames.init();
      this._merchantFields.init();
    });
  }

  public ApplePay(config: IApplePayConfig): ApplePay {
    const { applepay } = this.Environment();

    return new applepay(this._configProvider, this._communicator);
  }

  public VisaCheckout(config: IVisaConfig): VisaCheckout {
    const { visa } = this.Environment();

    return new visa(this._configProvider, this._communicator);
  }

  public updateJWT(jwt: string): void {
    if (jwt) {
      this._config = { ...this._config, jwt };
      this._configService.update(this._config);
      (() => {
        const a = StCodec.updateJWTValue(jwt);
        debounce(() => a, ST.DEBOUNCE_JWT_VALUE);
      })();
    } else {
      throw Error(this._translation.translate(ST.JWT_NOT_SPECIFIED_MESSAGE));
    }
  }

  public destroy(): void {
    this._messageBus.publish(
      {
        type: MessageBus.EVENTS_PUBLIC.DESTROY
      },
      true
    );

    this._destroy$.next();
    this._destroy$.complete();
    this._communicator.close();
  }

  private init(): void {
    // TODO theres probably a better way rather than having to remember to update Selectors
    Selectors.MERCHANT_FORM_SELECTOR = this._config.formId;
    this.initCallbacks(this._config);
    this.Storage(this._config);
    this._translation = new Translator(this._storage.getItem(ST.LOCALE_STORAGE));
    this._googleAnalytics.init();
    this.CommonFrames(this._config);
    this._commonFrames.init();
    this.displayLiveStatus(Boolean(this._config.livestatus));
    this.watchForFrameUnload();
    this.initControlFrameModal();
  }

  private CardFrames(config: IConfig): void {
    this._cardFrames = new CardFrames(
      config.jwt,
      config.origin,
      config.componentIds,
      config.styles,
      config.components.paymentTypes,
      config.components.defaultPaymentType,
      config.animatedCard,
      config.buttonId,
      config.fieldsToSubmit
    );
  }

  private CommonFrames(config: IConfig): void {
    this._commonFrames = new CommonFrames(
      config.jwt,
      config.origin,
      config.componentIds,
      config.styles,
      config.submitOnSuccess,
      config.submitOnError,
      config.submitFields,
      config.datacenterurl,
      config.animatedCard,
      config.components.requestTypes
    );
  }

  private Environment(): { applepay: any; visa: any } {
    return {
      applepay: environment.testEnvironment ? ApplePayMock : ApplePay,
      visa: environment.testEnvironment ? VisaCheckoutMock : VisaCheckout
    };
  }

  private Storage(config: IConfig): void {
    this._storage.setItem(ST.MERCHANT_TRANSLATIONS_STORAGE, JSON.stringify(config.translations));
    this._storage.setItem(ST.LOCALE_STORAGE, JwtDecode<IStJwtObj>(config.jwt).payload.locale);
  }

  private displayLiveStatus(liveStatus: boolean): void {
    if (!liveStatus) {
      /* tslint:disable:no-console */
      console.log(
        '%cThe %csecure%c//%ctrading %cLibrary is currently working in test mode. Please check your configuration.',
        'margin: 100px 0; font-size: 2em; color: #e71b5a',
        'font-size: 2em; font-weight: bold',
        'font-size: 2em; font-weight: 1000; color: #e71b5a',
        'font-size: 2em; font-weight: bold',
        'font-size: 2em; font-weight: regular; color: #e71b5a'
      );
    }
  }

  private watchForFrameUnload(): void {
    const controlFrameStatus = [false, false];

    const observer = new MutationObserver(() => {
      const controlFrame = document.getElementById(Selectors.CONTROL_FRAME_IFRAME);

      controlFrameStatus.push(Boolean(controlFrame));
      controlFrameStatus.shift();

      const [previousStatus, currentStatus] = controlFrameStatus;

      if (previousStatus && !currentStatus) {
        this.destroy();
        observer.disconnect();
      }
    });

    observer.observe(document, {
      subtree: true,
      childList: true
    });
  }

  private initCallbacks(config: IConfig): void {
    if (config.submitCallback) {
      this.submitCallback = config.submitCallback;
    }

    if (config.successCallback) {
      this.successCallback = config.successCallback;
    }

    if (config.errorCallback) {
      this.errorCallback = config.errorCallback;
    }
  }

  private initControlFrameModal(): void {
    const className = ST.MODAL_CONTROL_FRAME_CLASS;

    this._messageBus
      .pipe(ofType(MessageBus.EVENTS_PUBLIC.CONTROL_FRAME_SHOW), takeUntil(this._destroy$))
      .subscribe(() => document.getElementById(Selectors.CONTROL_FRAME_IFRAME).classList.add(className));

    this._messageBus
      .pipe(ofType(MessageBus.EVENTS_PUBLIC.CONTROL_FRAME_HIDE), takeUntil(this._destroy$))
      .subscribe(() => document.getElementById(Selectors.CONTROL_FRAME_IFRAME).classList.remove(className));
  }
}

export default (config: IConfig) => {
  Container.get(ConfigService).update(config);

  return Container.get(ST);
};
