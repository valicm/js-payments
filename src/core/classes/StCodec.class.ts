import Language from '../shared/Language';

interface IStRequest {
  requesttypedescription: string;
  pan?: string;
  sitereference?: string;
  accounttypedescription?: string;
  expirydate?: string;
  securitycode?: string;
}

/***
 * Encodes and Decodes a request for the ST gateway
 */
class StCodec {
  public static CONTENT_TYPE = 'application/json';
  public static VERSION = '1.00';
  public static SUPPORTED_REQUEST_TYPES = ['WALLETVERIFY', 'THREEDINIT', 'THREEDQUERY', 'CACHETOKENISE', 'AUTH'];

  private _requestId: string;
  private _jwt: string;

  constructor(jwt: string) {
    this._requestId = this._createRequestId();
    this._jwt = jwt;
  }

  /**
   * Generate a unique ID for a request
   * (this is informational. it doesn't need to be cryptographically random since one of those is allocated server-side)
   * @param length The total length of the Request ID
   *   (since we prepend 'J-' the random section will be 2 char shorter)
   * @return A newly generated random request ID
   */
  public _createRequestId(length = 10) {
    return (
      'J-' +
      Math.random()
        .toString(36)
        .substring(2, length)
    );
  }

  /**
   * Add the wrapper data to the request object
   * @param requestData The data to be contained in this request
   * @return A JS object ready to be encoded
   */
  public buildRequestObject(requestData: object): object {
    return {
      jwt: this._jwt,
      request: [
        {
          ...requestData,
          requestid: this._requestId
        }
      ],
      version: StCodec.VERSION
    };
  }

  /**
   * Encode the request to send to the gateway
   * includes simple validation so we don't send utterly invalid requests
   * @param requestObject The data to be contained in the request
   * @return A JSON string for the fetch request body
   */
  public encode(requestObject: IStRequest) {
    if (
      Object.keys(requestObject).length < 2 ||
      !StCodec.SUPPORTED_REQUEST_TYPES.includes(requestObject.requesttypedescription)
    ) {
      throw new Error(Language.translations.COMMUNICATION_ERROR_INVALID_REQUEST);
    }
    return JSON.stringify(this.buildRequestObject(requestObject));
  }

  /**
   * Verify the response from the gateway
   * @param responseData The response from the gateway
   * @return The content of the response that can be used in the following processes
   */
  public verifyResponseObject(responseData: any): object {
    // Ought we keep hold of the requestreference (eg. log it to console)
    // So that we can link these requests up with the gateway?
    if (
      !(
        responseData &&
        responseData.version === StCodec.VERSION &&
        responseData.response &&
        responseData.response.length === 1
      )
    ) {
      throw new Error(Language.translations.COMMUNICATION_ERROR_INVALID_RESPONSE);
    }
    const responseContent = responseData.response[0];
    if (responseContent.errorcode !== '0') {
      // Should this be a custom error type which can also take a field that is at fault
      // so that errordata can be sent up to highlight the field?
      throw new Error(responseContent.errormessage);
    }
    return responseContent;
  }

  /**
   * Decode the Json body from the fetch response
   * @Param responseObject The response object from the fetch promise
   * @return A Promise that resolves the body content (or raise an error casing the fetch to be rejected)
   */
  public decode(responseObject: Response | {}): Promise<object> {
    return new Promise((resolve, reject) => {
      if ('json' in responseObject) {
        responseObject.json().then(responseData => {
          resolve(this.verifyResponseObject(responseData));
        });
      } else {
        reject(new Error(Language.translations.COMMUNICATION_ERROR_INVALID_RESPONSE));
      }
    });
  }
}

export { StCodec, IStRequest };