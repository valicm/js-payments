import JwtDecode from 'jwt-decode';
import { BypassCards } from '../../application/core/models/constants/BypassCards';
import { FormState } from '../../application/core/models/constants/FormState';
import { IMessageBusEvent } from '../../application/core/models/IMessageBusEvent';
import { IValidationMessageBus } from '../../application/core/models/IValidationMessageBus';
import { Element } from './Element';
import { DomMethods } from '../../application/core/shared/DomMethods';
import { Language } from '../../application/core/shared/Language';
import { MessageBus } from '../../application/core/shared/MessageBus';
import { Selectors } from '../../application/core/shared/Selectors';
import { Translator } from '../../application/core/shared/Translator';
import { Validation } from '../../application/core/shared/Validation';
import { RegisterFrames } from './RegisterFrames.class';
import { iinLookup } from '@securetrading/ts-iin-lookup';
import { StJwt } from '../../application/core/shared/StJwt';

export class CardFrames extends RegisterFrames {
  private static CARD_NUMBER_FIELD_NAME: string = 'pan';
  private static CLICK_EVENT: string = 'click';
  private static COMPLETE_FORM_NUMBER_OF_FIELDS: number = 3;
  private static EXPIRY_DATE_FIELD_NAME: string = 'expirydate';
  private static INPUT_EVENT: string = 'input';
  private static NO_CVV_CARDS: string[] = ['PIBA'];
  private static ONLY_CVV_NUMBER_OF_FIELDS: number = 1;
  private static SUBMIT_EVENT: string = 'submit';
  private static SECURITY_CODE_FIELD_NAME: string = 'securitycode';
  private static SUBMIT_BUTTON_AS_BUTTON_MARKUP: string = 'button[type="submit"]';
  private static SUBMIT_BUTTON_AS_INPUT_MARKUP: string = 'input[type="submit"]';
  private static SUBMIT_BUTTON_DISABLED_CLASS: string = 'st-button-submit__disabled';

  private _animatedCardMounted: HTMLElement;
  private _cardNumberMounted: HTMLElement;
  private _expirationDateMounted: HTMLElement;
  private _securityCodeMounted: HTMLElement;
  private _animatedCard: Element;
  private _cardNumber: Element;
  private _expirationDate: Element;
  private _securityCode: Element;
  private _validation: Validation;
  private _translator: Translator;
  private _messageBusEvent: IMessageBusEvent = { data: { message: '' }, type: '' };
  private _submitButton: HTMLInputElement | HTMLButtonElement;
  private _buttonId: string;
  private _deferInit: boolean;
  private _payMessage: string;
  private _processingMessage: string;
  private _startOnLoad: boolean;
  private _fieldsToSubmitLength: number;
  private _isCardWithNoCvv: boolean;
  private _noFieldConfiguration: boolean;
  private _onlyCvvConfiguration: boolean;
  private _configurationForStandardCard: boolean;
  private _loadAnimatedCard: boolean;
  private _bypassCards: BypassCards[];
  private _stJwt: StJwt;

  constructor(private _messageBus: MessageBus) {
    super();
    this._stJwt = new StJwt(this.config.jwt);
    this._validation = new Validation();
    this._translator = new Translator(this._stJwt.locale);
    this._payMessage = this._translator.translate(Language.translations.PAY);
    this._processingMessage = `${this._translator.translate(Language.translations.PROCESSING)} ...`;
    this.configureFormFieldsAmount(this.config.jwt);
  }

  public init(): void {
    this._deferJsinitOnLoad();
    this._preventFormSubmit();
    this._createSubmitButton();
    this._initSubscribes();
    this._initCardFrames();
    this.elementsTargets = this.setElementsFields();
    this.registerElements(this.elementsToRegister, this.elementsTargets);
  }

  protected configureFormFieldsAmount(jwt: string): void {
    this._fieldsToSubmitLength = this.config.fieldsToSubmit.length;
    this._isCardWithNoCvv = jwt && CardFrames.NO_CVV_CARDS.includes(this._getCardType(jwt));
    this._noFieldConfiguration =
      this._fieldsToSubmitLength === CardFrames.ONLY_CVV_NUMBER_OF_FIELDS &&
      this._isCardWithNoCvv &&
      this.config.fieldsToSubmit.includes(CardFrames.SECURITY_CODE_FIELD_NAME);
    this._onlyCvvConfiguration =
      this._fieldsToSubmitLength === CardFrames.ONLY_CVV_NUMBER_OF_FIELDS &&
      !this._isCardWithNoCvv &&
      this.config.fieldsToSubmit.includes(CardFrames.SECURITY_CODE_FIELD_NAME);
    this._configurationForStandardCard =
      this._fieldsToSubmitLength === CardFrames.COMPLETE_FORM_NUMBER_OF_FIELDS &&
      this._loadAnimatedCard &&
      !this._isCardWithNoCvv &&
      this.config.fieldsToSubmit.includes(CardFrames.CARD_NUMBER_FIELD_NAME) &&
      this.config.fieldsToSubmit.includes(CardFrames.EXPIRY_DATE_FIELD_NAME) &&
      this.config.fieldsToSubmit.includes(CardFrames.SECURITY_CODE_FIELD_NAME);
  }

  protected registerElements(fields: HTMLElement[], targets: string[]): void {
    if (fields.length === targets.length) {
      targets.forEach((item, index) => {
        const element: HTMLElement = document.getElementById(item);
        if (element !== null) {
          element.appendChild(fields[index]);
        }
      });
    }
  }

  protected setElementsFields(): string[] {
    if (this._configurationForStandardCard) {
      return [
        this.config.componentIds.cardNumber,
        this.config.componentIds.expirationDate,
        this.config.componentIds.securityCode,
        this.config.componentIds.animatedCard
      ];
    } else if (this._onlyCvvConfiguration) {
      return [this.config.componentIds.securityCode];
    } else if (this._noFieldConfiguration) {
      return [];
    } else {
      return [
        this.config.componentIds.cardNumber, //
        this.config.componentIds.expirationDate,
        this.config.componentIds.securityCode
      ];
    }
  }

  private _createSubmitButton = (): HTMLInputElement | HTMLButtonElement => {
    const form = document.getElementById(Selectors.MERCHANT_FORM_SELECTOR);
    let button: HTMLInputElement | HTMLButtonElement = this._buttonId
      ? (document.getElementById(this._buttonId) as HTMLButtonElement | HTMLInputElement)
      : null;
    if (!button) {
      button =
        form.querySelector(CardFrames.SUBMIT_BUTTON_AS_BUTTON_MARKUP) ||
        form.querySelector(CardFrames.SUBMIT_BUTTON_AS_INPUT_MARKUP);
    }
    if (button) {
      button.textContent = this._payMessage;
      this._submitButton = button;
    }
    return button;
  };

  private _deferJsinitOnLoad(): void {
    if (!this._deferInit && this._startOnLoad) {
      this._publishSubmitEvent(true);
    }
  }

  private _disableFormField(state: FormState, eventName: string, target: string): void {
    const messageBusEvent: IMessageBusEvent = {
      data: state,
      type: eventName
    };
    this._messageBus.publish(messageBusEvent);
  }

  private _disableSubmitButton(state: FormState): void {
    if (this._submitButton) {
      this._setSubmitButtonProperties(this._submitButton, state);
    }
  }

  private _getCardType(jwt: string): string {
    const cardDetails = JwtDecode(jwt) as any;
    if (cardDetails.payload.pan) {
      return iinLookup.lookup(cardDetails.payload.pan).type;
    }
  }

  private _initCardNumberFrame(styles: {}): void {
    this._cardNumber = new Element();
    this._cardNumber.create(Selectors.CARD_NUMBER_COMPONENT_NAME, styles, {
      locale: this._stJwt.locale,
      origin: this.config.datacenterurl
    });
    this._cardNumberMounted = this._cardNumber.mount(Selectors.CARD_NUMBER_IFRAME);
    this.elementsToRegister.push(this._cardNumberMounted);
  }

  private _initExpiryDateFrame(styles: {}): void {
    this._expirationDate = new Element();
    this._expirationDate.create(Selectors.EXPIRATION_DATE_COMPONENT_NAME, styles, {
      locale: this._stJwt.locale,
      origin: this.config.datacenterurl
    });
    this._expirationDateMounted = this._expirationDate.mount(Selectors.EXPIRATION_DATE_IFRAME);
    this.elementsToRegister.push(this._expirationDateMounted);
  }

  private _initSecurityCodeFrame(styles: {}): void {
    this._securityCode = new Element();
    this._securityCode.create(Selectors.SECURITY_CODE_COMPONENT_NAME, styles, {
      locale: this._stJwt.locale,
      origin: this.config.datacenterurl
    });
    this._securityCodeMounted = this._securityCode.mount(Selectors.SECURITY_CODE_IFRAME);
    this.elementsToRegister.push(this._securityCodeMounted);
  }

  private _initAnimatedCardFrame(): void {
    this._animatedCard = new Element();
    this._animatedCard.create(
      Selectors.ANIMATED_CARD_COMPONENT_NAME,
      {},
      {
        locale: this._stJwt.locale,
        origin: this.config.datacenterurl,
        paymentTypes: this.config.components.paymentTypes,
        defaultPaymentType: this.config.components.defaultPaymentType
      }
    );
    this._animatedCardMounted = this._animatedCard.mount(Selectors.ANIMATED_CARD_COMPONENT_IFRAME, '-1');
    this.elementsToRegister.push(this._animatedCardMounted);
  }

  private _initCardFrames(): void {
    const { defaultStyles } = this.styles;
    let { cardNumber, securityCode, expirationDate } = this.styles;
    cardNumber = Object.assign({}, defaultStyles, cardNumber);
    securityCode = Object.assign({}, defaultStyles, securityCode);
    expirationDate = Object.assign({}, defaultStyles, expirationDate);
    if (this._onlyCvvConfiguration) {
      this._initSecurityCodeFrame(securityCode);
    } else if (this._configurationForStandardCard) {
      this._initCardNumberFrame(cardNumber);
      this._initExpiryDateFrame(expirationDate);
      this._initSecurityCodeFrame(securityCode);
      this._initAnimatedCardFrame();
    } else {
      this._initCardNumberFrame(cardNumber);
      this._initExpiryDateFrame(expirationDate);
      this._initSecurityCodeFrame(securityCode);
    }
  }

  private _initSubscribes(): void {
    this._submitFormListener();
    this._subscribeBlockSubmit();
    this._validateFieldsAfterSubmit();
    this._setMerchantInputListeners();
  }

  private _onInput(): void {
    const messageBusEvent: IMessageBusEvent = {
      data: DomMethods.parseForm(),
      type: MessageBus.EVENTS_PUBLIC.UPDATE_MERCHANT_FIELDS
    };
    this._messageBus.publish(messageBusEvent);
  }

  private _publishSubmitEvent(deferInit: boolean): void {
    const messageBusEvent: IMessageBusEvent = {
      data: {
        bypassCards: this._bypassCards,
        deferInit,
        fieldsToSubmit: this.config.fieldsToSubmit
      },
      type: MessageBus.EVENTS_PUBLIC.SUBMIT_FORM
    };
    this._messageBus.publish(messageBusEvent);
  }

  private _publishValidatedFieldState(field: { message: string; state: boolean }, eventType: string): void {
    this._messageBusEvent.type = eventType;
    this._messageBusEvent.data.message = field.message;
    this._messageBus.publish(this._messageBusEvent);
  }

  private _setMerchantInputListeners(): void {
    const els = DomMethods.getAllFormElements(document.getElementById(Selectors.MERCHANT_FORM_SELECTOR));
    for (const el of els) {
      el.addEventListener(CardFrames.INPUT_EVENT, this._onInput.bind(this));
    }
  }

  private _setSubmitButtonProperties(element: any, state: FormState): HTMLElement {
    let disabledState;
    if (state === FormState.BLOCKED) {
      element.textContent = this._processingMessage;
      element.classList.add(CardFrames.SUBMIT_BUTTON_DISABLED_CLASS);
      disabledState = true;
    } else if (state === FormState.COMPLETE) {
      element.textContent = this._payMessage;
      element.classList.add(CardFrames.SUBMIT_BUTTON_DISABLED_CLASS); // Keep it locked but return it to original text
      disabledState = true;
    } else {
      element.textContent = this._payMessage;
      element.classList.remove(CardFrames.SUBMIT_BUTTON_DISABLED_CLASS);
      disabledState = false;
    }
    element.disabled = disabledState;
    return element;
  }

  private _submitFormListener(): void {
    if (this._submitButton) {
      this._submitButton.addEventListener(CardFrames.CLICK_EVENT, () => {
        this._publishSubmitEvent(this._deferInit);
      });
    }
    this._messageBus.subscribe(MessageBus.EVENTS_PUBLIC.CALL_SUBMIT_EVENT, () => {
      this._publishSubmitEvent(this._deferInit);
    });
  }

  private _subscribeBlockSubmit(): void {
    this._messageBus.subscribe(MessageBus.EVENTS_PUBLIC.BLOCK_FORM, (state: FormState) => {
      this._disableSubmitButton(state);
      this._disableFormField(state, MessageBus.EVENTS_PUBLIC.BLOCK_CARD_NUMBER, Selectors.CARD_NUMBER_IFRAME);
      this._disableFormField(state, MessageBus.EVENTS_PUBLIC.BLOCK_EXPIRATION_DATE, Selectors.EXPIRATION_DATE_IFRAME);
      this._disableFormField(state, MessageBus.EVENTS_PUBLIC.BLOCK_SECURITY_CODE, Selectors.SECURITY_CODE_IFRAME);
    });
  }

  private _validateFieldsAfterSubmit(): void {
    this._messageBus.subscribe(MessageBus.EVENTS.VALIDATE_FORM, (data: IValidationMessageBus) => {
      const { cardNumber, expirationDate, securityCode } = data;
      if (!cardNumber.state) {
        this._publishValidatedFieldState(cardNumber, MessageBus.EVENTS.VALIDATE_CARD_NUMBER_FIELD);
      }
      if (!expirationDate.state) {
        this._publishValidatedFieldState(expirationDate, MessageBus.EVENTS.VALIDATE_EXPIRATION_DATE_FIELD);
      }
      if (!securityCode.state) {
        this._publishValidatedFieldState(securityCode, MessageBus.EVENTS.VALIDATE_SECURITY_CODE_FIELD);
      }
    });
  }

  private _preventFormSubmit(): void {
    document
      .getElementById(Selectors.MERCHANT_FORM_SELECTOR)
      .addEventListener(CardFrames.SUBMIT_EVENT, event => event.preventDefault());
  }
}
