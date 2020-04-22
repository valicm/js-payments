import { CardinalCommerce } from '../../application/core/integrations/CardinalCommerce';
import { Element } from './Element';
import { DomMethods } from '../../application/core/shared/DomMethods';
import { MessageBus } from '../../application/core/shared/MessageBus';
import { Selectors } from '../../application/core/shared/Selectors';
import { Validation } from '../../application/core/shared/Validation';
import { RegisterFrames } from './RegisterFrames.class';
import { Container } from 'typedi';
import { BrowserLocalStorage } from '../../shared/services/storage/BrowserLocalStorage';

export class CommonFrames extends RegisterFrames {
  private static readonly COMPLETED_REQUEST_TYPES = ['AUTH', 'CACHETOKENISE', 'ACCOUNTCHECK'];
  public elementsTargets: any;
  public elementsToRegister: HTMLElement[];
  private _controlFrame: Element;
  private _controlFrameMounted: HTMLElement;
  private _notificationFrame: Element;
  private _requestTypes: string[];
  private readonly _merchantForm: HTMLFormElement;
  private _validation: Validation;
  private _localStorage: BrowserLocalStorage = Container.get(BrowserLocalStorage);

  constructor(private _messageBus: MessageBus) {
    super();
    this._requestTypes = this.config.requestTypes || this.config.components.requestTypes;
    this._merchantForm = document.getElementById(this.config.formId) as HTMLFormElement;
    this._validation = new Validation();
  }

  public init(): void {
    this._initFormFields();
    this._setMerchantInputListeners();
    this._setTransactionCompleteListener();
    this.registerElements(this.elementsToRegister, this.elementsTargets);
  }

  protected registerElements(fields: HTMLElement[], targets: string[]): void {
    targets.map((item, index) => {
      const itemToChange = document.getElementById(item);
      if (fields[index]) {
        itemToChange.appendChild(fields[index]);
      }
    });
  }

  protected setElementsFields(): string[] {
    const elements = [];
    elements.push(this.config.formId);
    return elements;
  }

  private _getSubmitFields(data: any): string[] {
    const fields = this.config.submitFields;
    if (data.hasOwnProperty('jwt') && fields.indexOf('jwt') === -1) {
      fields.push('jwt');
    }
    if (data.hasOwnProperty('threedresponse') && fields.indexOf('threedresponse') === -1) {
      fields.push('threedresponse');
    }
    return fields;
  }

  private _initFormFields(): void {
    const { defaultStyles } = this.styles;
    let { controlFrame } = this.styles;

    controlFrame = Object.assign({}, defaultStyles, controlFrame);

    this._notificationFrame = new Element();
    this._controlFrame = new Element();
    this._controlFrame.create(Selectors.CONTROL_FRAME_COMPONENT_NAME, controlFrame, {
      gatewayUrl: this.config.datacenterurl,
      jwt: this.config.jwt,
      origin: this.config.origin
    });
    this._controlFrameMounted = this._controlFrame.mount(Selectors.CONTROL_FRAME_IFRAME, '-1');
    this.elementsToRegister.push(this._controlFrameMounted);
  }

  private _isThreedComplete(data: any): boolean {
    if (this._requestTypes[this._requestTypes.length - 1] === 'THREEDQUERY') {
      return (
        // @ts-ignore
        (!CardinalCommerce._isCardEnrolledAndNotFrictionless(data) && data.requesttypedescription === 'THREEDQUERY') ||
        data.threedresponse !== undefined
      );
    }
    return false;
  }

  private _isTransactionFinished(data: any): boolean {
    if (CommonFrames.COMPLETED_REQUEST_TYPES.includes(data.requesttypedescription)) {
      return true;
    } else if (this._isThreedComplete(data)) {
      return true;
    }
    return false;
  }

  private _onInput(): void {
    const messageBusEvent = {
      data: DomMethods.parseForm(),
      type: MessageBus.EVENTS_PUBLIC.UPDATE_MERCHANT_FIELDS
    };
    this._messageBus.publish(messageBusEvent);
  }

  private _onTransactionComplete(data: any): void {
    if (this._isTransactionFinished(data) || data.errorcode !== '0') {
      this._messageBus.publish({ data, type: MessageBus.EVENTS_PUBLIC.CALL_MERCHANT_SUBMIT_CALLBACK }, true);
    }
    if (this._shouldSubmitForm(data)) {
      const form = this._merchantForm;
      DomMethods.addDataToForm(form, data, this._getSubmitFields(data));
      form.submit();
    }
  }

  private _setMerchantInputListeners(): void {
    const els = DomMethods.getAllFormElements(this._merchantForm);
    for (const el of els) {
      el.addEventListener('input', this._onInput.bind(this));
    }
  }

  private _setTransactionCompleteListener(): void {
    this._messageBus.subscribe(MessageBus.EVENTS_PUBLIC.TRANSACTION_COMPLETE, (data: any) => {
      if (data.walletsource === 'APPLEPAY') {
        const localStore = this._localStorage.getItem('completePayment');
        setTimeout(() => {
          if (localStore === 'true') {
            this._onTransactionComplete(data);
          }
        }, 500);
      } else {
        this._onTransactionComplete(data);
      }
    });
  }

  private _shouldSubmitForm(data: any): boolean {
    return (
      (this.config.submitOnSuccess && data.errorcode === '0' && this._isTransactionFinished(data)) ||
      (this.config.submitOnError && data.errorcode !== '0')
    );
  }
}
