/***
 * Defines input with iframe source
 * Can be styled by predefined JSON.
 */

class Element {
  /***
   * Function which defines iframe src attribute
   * @param name Component name
   * @returns URL of input iframe
   */
  public static getComponentAddress(name: string) {
    if (name === Element.CARD_NUMBER_COMPONENT_NAME) {
      return Element.CARD_NUMBER_COMPONENT;
    } else if (name === Element.SECURITY_CODE_COMPONENT_NAME) {
      return Element.SECURITY_CODE_COMPONENT;
    } else if (name === Element.EXPIRATION_DATE_COMPONENT_NAME) {
      return Element.EXPIRATION_DATE_COMPONENT;
    }
  }

  public static CARD_NUMBER_COMPONENT_NAME: string = 'cardNumber';
  public static SECURITY_CODE_COMPONENT_NAME: string = 'securityCode';
  public static EXPIRATION_DATE_COMPONENT_NAME: string = 'expirationDate';
  public static CARD_NUMBER_COMPONENT: string = '/card-number.html';
  public static SECURITY_CODE_COMPONENT: string = '/security-code.html';
  public static EXPIRATION_DATE_COMPONENT: string = '/expiration-date.html';

  /**
   * Method for creating DOM elements
   * @param type Type of element which we are creating
   * @param id ID of element
   */
  private static createFormElement = (type: string, id: string) => {
    const element = document.createElement(type);
    element.setAttribute('id', id);
    element.setAttribute('class', id);
    return element;
  };

  private _name: string;
  private _iframeSrc: string;

  get iframeSrc(): string {
    return this._iframeSrc;
  }

  set iframeSrc(value: string) {
    this._iframeSrc = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  constructor() {
    this._name = '';
  }

  /***
   * Method for creating element in iframe
   * @param elementName Name of input which we want to create
   */

  public create(elementName: string) {
    this._name = elementName;
    this.iframeSrc = Element.getComponentAddress(elementName);
  }

  /***
   * Method returns 'iframed input', styled and ready to be registered in clients form
   * @param fieldId ID of field on which iframe input field will be mounted
   */
  public mount(fieldId: string) {
    const iframe = Element.createFormElement('iframe', fieldId);
    iframe.setAttribute('src', this.iframeSrc);
    return iframe;
  }
}

export default Element;
