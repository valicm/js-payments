import { BypassCards } from '../../../application/core/models/constants/BypassCards';
import { IBypassInit } from './IBypassInit';
import { IComponentsConfig } from './IComponentsConfig';
import { IComponentsIds } from './IComponentsIds';
import { IStyles } from './IStyles';
import { IPlaceholdersConfig } from '../../../application/core/models/IPlaceholdersConfig';
import { IVisaCheckout } from '../../../application/core/models/constants/IVisaCheckout';
import { IApplePay } from '../../../application/core/models/IApplePay';

export interface IConfig {
  analytics?: boolean;
  animatedCard?: boolean;
  applePay?: IApplePay | {};
  buttonId?: string;
  bypassCards?: BypassCards[];
  cachetoken?: string;
  components?: IComponentsConfig;
  componentIds?: IComponentsIds;
  cybertonicaApiKey?: string;
  datacenterurl?: string;
  deferInit?: boolean;
  disableNotification?: boolean;
  fieldsToSubmit?: string[];
  formId?: string;
  init?: IBypassInit;
  jwt: string;
  livestatus?: 0 | 1;
  origin?: string;
  panIcon?: boolean;
  placeholders?: IPlaceholdersConfig;
  requestTypes?: string[];
  styles?: IStyles;
  submitCallback?: any;
  successCallback?: any;
  errorCallback?: any;
  submitFields?: string[];
  submitOnSuccess?: boolean;
  submitOnError?: boolean;
  threedinit?: string;
  translations?: {};
  visaCheckout?: IVisaCheckout;
}
