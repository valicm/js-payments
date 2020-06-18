import { BypassCards } from '../../../application/core/models/constants/BypassCards';
import { IBypassInit } from './IBypassInit';
import { IComponentsConfig } from './IComponentsConfig';
import { IComponentsIds } from './IComponentsIds';
import { IStyles } from './IStyles';
import { IPlaceholdersConfig } from '../../../application/core/models/IPlaceholdersConfig';
import { IVisaCheckout } from '../../../application/core/models/visa-checkout/IVisaCheckout';
import { IApplePay } from '../../../application/core/models/IApplePay';

export interface IConfig {
  analytics?: boolean;
  animatedCard?: boolean;
  applePay?: IApplePay;
  buttonId?: string;
  bypassCards?: BypassCards[];
  cancelCallback?: any;
  components?: IComponentsConfig;
  componentIds?: IComponentsIds;
  cybertonicaApiKey?: string;
  datacenterurl?: string;
  deferInit?: boolean;
  disableNotification?: boolean;
  errorCallback?: any;
  errorReporting?: boolean;
  fieldsToSubmit?: string[];
  formId?: string;
  init?: IBypassInit;
  jwt: string;
  livestatus?: 0 | 1;
  origin?: string;
  panIcon?: boolean;
  placeholders?: IPlaceholdersConfig;
  styles?: IStyles;
  submitCallback?: any;
  submitFields?: string[];
  submitOnCancel?: boolean;
  submitOnError?: boolean;
  submitOnSuccess?: boolean;
  successCallback?: any;
  translations?: {};
  visaCheckout?: IVisaCheckout;
}
