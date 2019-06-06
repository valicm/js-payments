import { IMessageBusValidateField } from '../models/Validation';
import MessageBus from '../shared/MessageBus';
import Validation from '../shared/Validation';

/**
 * Represents merchant fields which must be validated.
 */
export class MerchantFields {
  private static readonly DATA_ATTRIBUTE_NAME: string = 'stName';
  public validation: Validation;
  private _messageBus: MessageBus;

  constructor() {
    this._messageBus = new MessageBus();
    this.validation = new Validation();
    this.findAllMerchantInputs();
  }

  /**
   * Listens to backend validation event from MessageBus and sets proper validation actions.
   * @param inputElement
   * @param messageElement
   * @param event
   */
  public backendValidation(inputElement: HTMLInputElement, event: string, messageElement: HTMLElement) {
    this._messageBus.subscribe(event, (data: IMessageBusValidateField) => {
      this.validation.checkBackendValidity(data, inputElement, messageElement);
      this.validation.validate(inputElement, messageElement);
    });
  }

  /**
   * Checks if Merchant's form has inputs with data-st-name and  returns them.
   */
  public findAllMerchantInputs() {
    const merchantInputs = document.getElementsByTagName('input') as HTMLCollection;
    const merchantFieldsNamesArray = [];
    for (let i = 0; i < merchantInputs.length; ++i) {
      // @ts-ignore
      if (merchantInputs[i].dataset.hasOwnProperty(MerchantFields.DATA_ATTRIBUTE_NAME)) {
        // @ts-ignore
        this.backendValidation(
          document.getElementById(merchantInputs[i].id),
          MessageBus.EVENTS.VALIDATE_MERCHANT_FIELD
        );
        // @ts-ignore
        merchantFieldsNamesArray.push(merchantInputs[i].dataset[MerchantFields.DATA_ATTRIBUTE_NAME]);
      }
    }

    return { merchantFieldsNamesArray };
  }
}
