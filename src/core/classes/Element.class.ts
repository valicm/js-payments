import { iframesEndpoints, styleForIframe } from '../imports/iframe';

const { cardNumber, securityCode, expirationDate } = iframesEndpoints;

const RegisterElements = (fields: HTMLElement[], form: string) => {
  const formContainer = document.getElementById(form);
  const promise1 = new Promise((resolve, reject) => {
    fields.forEach(item => {
      formContainer.appendChild(item);
    });
    resolve('well done !');
    reject('something went wrong :(');
  });
};

class Element {
  private _name: string;
  private _iframeSrc: string;
  private _style: object;

  get style(): object {
    return this._style;
  }

  set style(value: object) {
    this._style = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get iframeSrc(): string {
    return this._iframeSrc;
  }

  set iframeSrc(value: string) {
    this._iframeSrc = value;
  }

  constructor() {
    this._name = '';
    this._style = {
      color: '#fff',
      fontWeight: '600',
      fontFamily: 'Lato, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
    };
  }

  static getComponentAdress(name: string) {
    if (name === 'cardNumber') {
      return cardNumber;
    } else if (name === 'securityCode') {
      return securityCode;
    } else if (name === 'expirationDate') {
      return expirationDate;
    }
  }

  create(elementName: string, attributes: any) {
    this._name = elementName;
    this._style = attributes;
    this._iframeSrc = Element.getComponentAdress(elementName);
  }

  mount(fieldId: string) {
    let iframe = document.createElement('iframe');
    iframe.setAttribute(
      'src',
      `${this._iframeSrc}?${JSON.stringify(this._style)}`
    );
    iframe.setAttribute('id', fieldId);
    Object.assign(iframe.style, styleForIframe);
    return iframe;
  }
}

export { Element, RegisterElements };
