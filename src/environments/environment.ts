export const environment = {
  production: false,
  testEnvironment: false,
  // @ts-ignore
  FRAME_URL: `https://${HOST}:8443`,
  GATEWAY_URL: 'https://webservices.securetrading.net/jwt/',
  SONGBIRD_URL: 'https://songbirdstag.cardinalcommerce.com/cardinalcruise/v1/songbird.js',
  CARDINAL_COMMERCE_CONFIG: {
    logging: { level: 'on' }
  },
  APM_NAMES: {
    APPLE_PAY: 'APPLEPAY',
    VISA_CHECKOUT: 'VISACHECKOUT'
  },
  VISA_CHECKOUT_URLS: {
    DEV_BUTTON_URL: 'https://sandbox.secure.checkout.visa.com/wallet-services-web/xo/button.png',
    DEV_SDK: 'https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js',
    MOCK_DATA_URL: 'https://merchant.example.com:8443/visaPaymentStatus',
    PROD_BUTTON_URL: 'https://secure.checkout.visa.com/wallet-services-web/xo/button.png',
    PROD_SDK: 'https://secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js'
  },
  APPLE_PAY_URLS: {
    BUTTON_IMAGE:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANQAAAAmCAYAAAC8hLUKAAAABGdBTUEAALGPC/xhBQAABq5JREFUeAHtXWtIFVsUXqaSZZZ2QVD7IZfSotCwQjBNrETQIlAIsUDoivqjn+GvfgQpRYmhIImk0Q+zhxQmWBSFN26BmHmNtIf4uEQmJlrmi177rrVqhjPn+JjjjFc7dy3YM3v2Y+2Zb+81a++115wD8IMS8fQXhjEM3zEoCYKBjIE5xwDJCskMyQ7JEHj9jDTieSUlCAkCgsC8EJjAWqneeLiM4fd5sZBKgoAgoCHgi5ENpKFIZflrqXIWBASBeSMwTgJF80A6CwkCgoA1BBQJEhkghAQBQcAGBJbZwENYCAKCwE8ERKBkKAgCNiIgAmUjmGZYhYeHw7JlArsZrH7FMtKz/1GvhYaGwsOHD6G9vR2+fyc7kJAnIuDjiQ+11J7Jx8cH7t69C5s3b4arV68utduT+7EZAXEzWmBXqwMHDiiivr4+FRYWNiveOB1UzsHLy2vWOjgeJH+JYCBTPpvfTho7FAItCl++fIEzZ85AbGws9Pf36+nOkeTkZPj27ZtLmJychLa2Njh58iT4+fk5V5PrJYSACJTNnREXFwdXrlyBkZER6O7uhgsXLsCqVatgYmICamtrOZ3ybt68CREREaZaX758OWzduhWOHz8OT548gZUrxe3SFHCLVEimCzZNFxITE9X4+DhP78wc3rx5o/z9/XX8UUPp1fbt26eCg4NVSEiIOnjwoKqvr9fzzp49q9fBMSPxpYWBdIgdg5IE48OHD/qgNxNJT083CIOjQO3cudOQ5+3trXC6yGx7enr0vE2bNqnS0lJ1//591dLSoq5fv66ys7N5HUbPhZpNXbx4kUNMTIxeT3vmgoICzkPt55KnlZGzWzLiVmEBfYa34eHDh83IkF6GBr7zQJ1NoKhsWVkZ10ezu1qxYoXKzMxUX79+1Xk6Rm7dusX8AwICFE43OevcuXOGNnEqqcbGxjjvxIkThjzne5Nrc3IiaygcKXYQagq32Ny7d8+t8lQ4Ojqa64yOjrLh4vz584CaC27fvg179uyB+Ph4qKqq4jL79++HlJQU+PTpEzQ0NHAaTiP5rB2SkpIANStfXr5MX/EIWUVABMoqgj/ro8awiZMrGxKatLQ02LVrF2c2NzcD7W2RgJAQZWRkwIMHD+DRo0dw9OhRwKknl9u2bRufa2pq+Lx+/XrYuHEjx+lAQkf09OlTeP36NcflYA0B2di1hp9eu6OjQ4+biezduxcqKytnLFpYWAhDQ0MsOGQ5RAMFl/38+TMcO3aMrYYkQESkZcgKuHbtWlizZg2QmT0wMBBwusf5d+7cgeHhYc4nIXr58iWnaxpLtBPDYdtB5s4zrIsQYdPY7Nixw3EJM2ec1kE4uA38HddQ0zHo6upSu3fv1utQHLWVIl7T0alTp/SyFRUVXATdnzgtKiqKr6nuXJvN7uDwfy8rGsqm99Lz58+B1jarV682xZE2fm/cuAE5OTlw6dIllzrFxcW8j0UZaDgA0oDUBm0SE5FGamxsBNqjam1t5XVSb28vT/fKy8th3bp1XE470LQvLy8PSNuRJtO0E/kXvn37VismZxsQ0N9iyEviFjAoKiqaTlHMmpaamqpj7qihnM3mzn2DXhPM9/379wq9J3Qe5KaE0zvOc9RQlE6uT0SHDh1Sjx8/5nhubq5e17kNuXZfHsQogaPGLkKzNODGrml2TU1NrGVMV3AoqLk2kUbEzV/OoTgKNQQFBTmU/BFF6WFPDbrKz89nNyjSdnV1dS5lJcEaAvKGsqCVEHoDfkeOHOE3/1wHnB6qyMhIQ113NNT27dv1PSg0VCh0SVJTU1NqYGBAvXv3jpt31FB0n1u2bDHcFprTDe07P4tcG/vWDB6ioRAlO6m6upqdWHHkMtsXL16wP9+1a9cABzunkRbLysqCV69ezbtp8unDqRug8ICvry+vqehbq4SEBECXpmn50hrs2bNneh75FgrZj4C8pZy0DEJsGRM0Cij8qNCFDzrEKjRpu6RbaZPaQgdcUzzJKkhEblKOfoRW2pe6hvFiuDDVKQLgr4UZCQ5N906fPs3CRAdxsF2wPlwwxiKcNmg6O15e2geOmjR1dnYq3ACW/lmA/pF9KByxnk60P0beEYODg+yeVFJSAh8/fvT0x16U55MfulwU2KVRT0VArHye2rPyXIuCgAjUosAujXoqAiRQtDgVEgQEAesIKBIo+qMoIUFAELCOwAQJVLt1PsJBEBAEEIG/ycqXiEH+ElTGgyBgDQH9L0H/QT706ecGDL9h8MVAgiYkCAgCsyNA9gcSpBYMf2D48181MTwQ821fWAAAAABJRU5ErkJggg==',
    MOCK_DATA_URL: 'https://merchant.example.com:8443/applePaymentStatus'
  }
};
