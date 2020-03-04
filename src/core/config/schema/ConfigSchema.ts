import Joi from 'joi';

export const ConfigSchema: Joi.JoiObject = Joi.object().keys({
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
  buttonId: Joi.string(),
  bypassCards: Joi.array().items(
    Joi.string().valid('AMEX', 'ASTROPAYCARD', 'DINERS', 'DISCOVER', 'JCB', 'MASTERCARD', 'MAESTRO', 'PIBA', 'VISA')
  ),
  cachetoken: Joi.string(),
  componentIds: Joi.object()
    .keys({
      animatedCard: Joi.string(),
      cardNumber: Joi.string().required(),
      expirationDate: Joi.string().required(),
      notificationFrame: Joi.string().required(),
      securityCode: Joi.string().required()
    })
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
  datacenterurl: Joi.string(),
  deferInit: Joi.boolean(),
  fieldsToSubmit: Joi.array().items(Joi.string().valid('pan', 'expirydate', 'securitycode')),
  formId: Joi.string(),
  init: {
    cachetoken: Joi.string().allow(''),
    threedinit: Joi.string().allow('')
  },
  jwt: Joi.string().required(),
  livestatus: Joi.number().valid(0, 1),
  notifications: Joi.boolean().default(true),
  origin: Joi.string(),
  requestTypes: Joi.array().items(
    Joi.string().valid('ACCOUNTCHECK', 'AUTH', 'JSINIT', 'RISKDEC', 'SUBSCRIPTION', 'THREEDQUERY')
  ),
  placeholders: Joi.object().keys({
    pan: Joi.string().allow(''),
    securitycode: Joi.string().allow(''),
    expirydate: Joi.string().allow('')
  }),
  styles: Joi.object(),
  submitCallback: Joi.any(),
  submitFields: Joi.array(),
  submitOnError: Joi.boolean(),
  submitOnSuccess: Joi.boolean(),
  threedinit: Joi.string(),
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
  }
});
