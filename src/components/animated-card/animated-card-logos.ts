const cardsLogos: { [brandName: string]: string } = {
  amex:
    'data:image/png;base64,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',
  astropaycard:
    'data:image/png;base64,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',
  default: '',
  diners:
    'data:image/png;base64,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',
  discover:
    'data:image/png;base64,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',
  jcb:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABBCAMAAABxRdOhAAACoFBMVEUAAAD////UG0E/o2+Zo8HCVWXC484/ea3bSWbeipjpQWnv9fk/nm/p9eVAdKhCqjRNrm1ctGtkuVtmuktue6d5w2V+xWR/tNt/vJ+Cxp6UJDAblzucbXCtXGOweH2x3KW23rO6WWS9Jz6/4c8faacfeLnG5c7KU2XK583LrrHOkJfP59vQUGXQ2+gfjVfUTmbZjZjau74kU5AAabbg8efkub7k19jlRGnnZIE/fbIPc7rqhZru5OU/isLw8vby+fLzscDzwsz4v8348fL64OX87/I/j8ifzLeq17UPiUs/kMpVszBYs04Ahz9ctT5fsocBRIlluWkBjD5ngKtoumhqvFltvWcEPoNvrdhwvYRxv2ZzKi91wWZ5wnQFOoB6KS97Nzx+xJAHjz1/o8Z/qcx/sdV/s9kIN3wNM3h/w5+AocOBKDCBnsEPaa6GyICHJzCHyJ2INTyJyoCKlrmMyo6OJjCOzH+RYGMASpCWX2MATZSbMjwPkTwSMHWfxeCfwduf0bef1IugITCitM6i1ZmmIDGn16cVlDyrHjGrLj0YLHKv0ekAUZewwtixHDEdKW+yS1e1vtS2GjIAVJq33sG5d325lJcAV567GDIAWqG/1ee/3s8imjq/4s7AFjLAzd8AX6kmOXvFEzMonDkvcaovgb7Lcn4vhcPODjQyoTfP4vE2pDY6WZLQrrE9pzXSCzQAYqwAZbDXCTXYnaQ/gbbaBzY/g7g/h77b7tneBDfean8AZ7Pf7PXf7uc/jcbhAjfhRmfi5O3jiZnjyMvkADgAR40AbLnlM1w/kszmVHQAe0AAfUDpprI/p24AgEDq1tjsxstCb6MAgj9Fql/yobTy4+VFq21HrDNMrjL28fIAhT9QsHr5z9lRsTFUsWxVX5Mok/J0AAAAAXRSTlMAQObYZgAAApBJREFUeF7t2GO3HEEQBuDUrHVt27aN2LZt27Zt27ZtO38ld6d7dyazlZ3dZD4k5877A55TfapOdZ9uUM8Dfx1EkwoEaSK1BwJvmYuLRpOff/b8heLi6zWNO1LgRXi4ShUbm5Sq1d7MzdXrKZD15b2b23d391Zt23fu6u3jQ0HOm5PRoeW9iZOXrtmwaefJU1cy7z8kXHDA7HkLl6/euH33wROnz126cZflSls0a9176oLArXsOHTnu+uHjtyYE5Lw2A7pj4LER4zAwsdFnEdBrIArGD0FAs/daBFROQ8GcHjiY8hwHrV7JLhychIN+T8RA5WIULOqCgymi4AocDMLB2sd/Ck7AQb//D5RBGYxiF2xNtBUMTjjzsi6621qGgLVGo1GhUDwjC1YU7AtsfAkYkg68VJWZwV9TGtbUcTCoCAQhoID0cBTMoUr2flVERFJqOR+cOcjff2RDIpocBWlWWprC5FVZQQXblF5EbOcUuI7fZQH4hpzZqQorA+yAa1lwtFPgHRxMjNymVmex9Q13lQDkMpbMoTQVWgZRApA2pRMhnevyFDtgIJlEkxD04sC9RDFkWkHggQ9wELwFINxSHiWgxkCQ/jwwYREBmcsVgB4ZwJMP0pTsGDq4TzI1prPra/0nOorZaWk63VOzI2gKTajgyMIY+tF92DO+0oHlAGE2Xf4xZlUy520exi3YUSHp74CmurzwkRm8tqUukeYK1TExcXHzPX4zhxmv2BdslM3Gtrxg5UsKAWVQBpfgYB4OeoqCBQYcrMDBWaKgL6CgHlCwuUkMPGDAwa84GAoiYMFhQMG3gILjOQ8H910FDGTKAAXngn0wegYAAjKF1YCB3S4ST/L/hn8clPoHqB7nJ7V63ZvrOsFdAAAAAElFTkSuQmCC',
  maestro:
    'data:image/png;base64,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',
  mastercard:
    'data:image/png;base64,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',
  piba:
    'data:image/png;base64,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',
  visa:
    'data:image/png;base64,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'
};

export { cardsLogos };
