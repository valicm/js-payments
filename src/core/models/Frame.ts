import { IStyle } from './Styler';

export interface IParams {
  [name: string]: object | string;
  styles?: IStyle;
  locale?: string;
  origin?: string;
  jwt?: string;
  gatewayUrl?: string;
  paymentTypes?: string;
  defaultPaymentType?: string;
}
