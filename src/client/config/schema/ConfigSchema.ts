import Joi from '@hapi/joi';

export const ConfigSchema: Joi.ObjectSchema = Joi.object().keys({
  analytics: Joi.boolean(),
  animatedCard: Joi.boolean(),
  applePay: {
    buttonStyle: Joi.string().valid('black', 'white', 'white-outline'),
    buttonText: Joi.string().valid('plain', 'buy', 'book', 'donate', 'check-out', 'subscribe'),
    merchantId: Joi.string(),
    requestTypes: Joi.array().items(
      Joi.string().valid('ACCOUNTCHECK', 'AUTH', 'JSINIT', 'RISKDEC', 'SUBSCRIPTION', 'THREEDQUERY')
    ),
    paymentRequest: {
      countryCode: Joi.string(),
      currencyCode: Joi.string(),
      merchantCapabilities: Joi.array().items(
        Joi.string().valid('supports3DS', 'supportsCredit', 'supportsDebit', 'supportsEMV')
      ),
      supportedNetworks: Joi.array().items(
        Joi.string().valid(
          'amex',
          'chinaUnionPay',
          'discover',
          'interac',
          'jcb',
          'masterCard',
          'privateLabel',
          'visa',
          'cartesBancaires',
          'eftpos',
          'electron',
          'maestro',
          'vPay',
          'elo',
          'mada'
        )
      ),
      total: {
        amount: Joi.string(),
        label: Joi.string()
      }
    },
    placement: Joi.string()
  },
  buttonId: Joi.string().allow(''),
  bypassCards: Joi.array().items(
    Joi.string().valid('AMEX', 'ASTROPAYCARD', 'DINERS', 'DISCOVER', 'JCB', 'MASTERCARD', 'MAESTRO', 'PIBA', 'VISA')
  ),
  cachetoken: Joi.string().allow(''),
  componentIds: Joi.object()
    .keys({
      animatedCard: Joi.string().allow('').default('st-animated-card'),
      cardNumber: Joi.string().allow('').default('st-card-number'),
      expirationDate: Joi.string().allow('').default('st-expiration-date'),
      notificationFrame: Joi.string().allow('').default('st-notification-frame'),
      securityCode: Joi.string().allow('').default('st-security-code')
    })
    .allow({})
    .default({}),
  components: Joi.object()
    .keys({
      defaultPaymentType: Joi.string().allow(''),
      requestTypes: Joi.array().items(
        Joi.string().valid('ACCOUNTCHECK', 'AUTH', 'JSINIT', 'RISKDEC', 'SUBSCRIPTION', 'THREEDQUERY')
      ),
      paymentTypes: Joi.array().items(Joi.string().allow('')),
      startOnLoad: Joi.boolean().allow('')
    })
    .default({}),
  datacenterurl: Joi.string().allow(''),
  deferInit: Joi.boolean(),
  disableNotification: Joi.boolean().default(false),
  fieldsToSubmit: Joi.array().items(Joi.string().valid('pan', 'expirydate', 'securitycode')),
  formId: Joi.string(),
  init: Joi.object()
    .keys({
      cachetoken: Joi.string().allow(''),
      threedinit: Joi.string().allow('')
    })
    .allow(null),
  jwt: Joi.string().required(),
  livestatus: Joi.number().valid(0, 1),
  origin: Joi.string().allow(''),
  requestTypes: Joi.array().items(
    Joi.string().valid('ACCOUNTCHECK', 'AUTH', 'JSINIT', 'RISKDEC', 'SUBSCRIPTION', 'THREEDQUERY')
  ),
  panIcon: Joi.boolean(),
  placeholders: Joi.object().keys({
    pan: Joi.string().allow(''),
    securitycode: Joi.string().allow(''),
    expirydate: Joi.string().allow('')
  }),
  styles: Joi.object(),
  submitCallback: Joi.any(),
  successCallback: Joi.any(),
  errorCallback: Joi.any(),
  submitFields: Joi.array(),
  submitOnError: Joi.boolean(),
  submitOnSuccess: Joi.boolean(),
  threedinit: Joi.string().allow(''),
  translations: Joi.object(),
  visaCheckout: {
    buttonSettings: {
      color: Joi.string(),
      size: Joi.string()
    },
    livestatus: Joi.number().valid(0, 1),
    merchantId: Joi.string(),
    paymentRequest: {
      subtotal: Joi.string()
    },
    placement: Joi.string(),
    requestTypes: Joi.array().items(
      Joi.string().valid('ACCOUNTCHECK', 'AUTH', 'JSINIT', 'RISKDEC', 'SUBSCRIPTION', 'THREEDQUERY')
    ),
    settings: {
      displayName: Joi.string()
    }
  },
  cybertonicaApiKey: Joi.string().allow('')
});
