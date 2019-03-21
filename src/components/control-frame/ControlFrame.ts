import Selectors from '../../core/shared/Selectors';
import MessageBus from '../../core/shared/MessageBus';

export default class ControlFrame {
  private _buttonElement: HTMLButtonElement;
  private messageBus: MessageBus;
  private formFields = {
    cardNumber: {
      validity: '',
      value: ''
    },
    expirationDate: {
      validity: '',
      value: ''
    },
    securityCode: {
      validity: '',
      value: ''
    }
  };

  constructor() {
    // @ts-ignore
    this._buttonElement = ControlFrame.ifFieldExists();
    this.messageBus = new MessageBus();
    this.onInit();
  }

  static ifFieldExists(): HTMLButtonElement {
    // @ts-ignore
    return document.getElementById(Selectors.CONTROL_FRAME_BUTTON_SELECTOR);
  }

  private onInit() {
    this.initEventListeners();
    this.initSubscriptions();
  }

  private onClick() {}

  private initSubscriptions() {
    this.messageBus.subscribe(MessageBus.EVENTS.CARD_NUMBER_CHANGE, (data: any) => {
      this.onCardNumberStateChange(data);
    });
    this.messageBus.subscribe(MessageBus.EVENTS.EXPIRATION_DATE_CHANGE, (data: any) => {
      this.onExpirationDateStateChange(data);
    });
    this.messageBus.subscribe(MessageBus.EVENTS.SECURITY_CODE_CHANGE, (data: any) => {
      this.onSecurityCodeStateChange(data);
    });
  }

  private onCardNumberStateChange(data: any) {
    this.formFields.cardNumber.validity = data.validity;
    this.formFields.cardNumber.value = data.value;
  }

  private onExpirationDateStateChange(data: any) {
    this.formFields.expirationDate.validity = data.validity;
    this.formFields.expirationDate.value = data.value;
  }

  private onSecurityCodeStateChange(data: any) {
    this.formFields.securityCode.validity = data.validity;
    this.formFields.securityCode.value = data.value;
  }

  private initEventListeners() {
    this._buttonElement.addEventListener('click', (event: Event) => {
      event.preventDefault();
      this.onClick();
    });
  }
}
