import { environment } from '../../environments/environment';
import DomMethods from '../shared/DomMethods';

/**
 * Creates HTML markups <script> and add Google Analytics source to it.
 */
class GoogleAnalytics {
  /**
   * Make GA send function available from class.
   */
  public static sendGaData(hitType: string, eventCategory: string, eventAction: string, eventLabel: string) {
    // @ts-ignore
    if (window.ga) {
      // @ts-ignore
      window.ga('send', { hitType, eventCategory, eventAction, eventLabel });
    } else {
      return false;
    }
  }

  private static GA_MEASUREMENT_ID: string = environment.GA_MEASUREMENT_ID;
  private static GA_INIT_SCRIPT_CONTENT: string = `window.ga=window.ga||function(){(ga.q=ga.q||[]).
  push(arguments)};ga.l=+new Date;
`;
  private static GA_SCRIPT_SRC: string = environment.GA_SCRIPT_SRC;
  private static GA_DISABLE_COOKIES: string = `ga('create', 'UA-${GoogleAnalytics.GA_MEASUREMENT_ID}'
  , {'storage': 'none'});`;
  private static GA_IP_ANONYMIZATION: string = `ga('set', 'anonymizeIp', true);`;
  private static GA_DISABLE_ADVERTISING_FEATURES: string = `ga('set', 'allowAdFeatures', false);`;
  private static GA_PAGE_VIEW: string = `ga('send', 'pageview', location.pathname);`;
  private static TRANSLATION_SCRIPT_SUCCEEDED: string = 'Google Analytics: script has been created';
  private static TRANSLATION_SCRIPT_FAILED: string = 'Google Analytics: an error occurred loading script';
  private static TRANSLATION_SCRIPT_APPENDED: string = 'Google Analytics: script has been appended';
  private static TRANSLATION_SCRIPT_APPENDED_FAILURE: string = 'Google Analytics: an error occurred appending script';

  /**
   * Disables User ID tracking (User Opt-out).
   * @private
   */
  private static _disableUserIDTracking() {
    // @ts-ignore
    return (window[`ga-disable-UA-${GoogleAnalytics.GA_MEASUREMENT_ID}-Y`] = true);
  }

  /**
   * Adds all required features by interpolating static strings.
   * @private
   */
  private static _returnScriptWithFeatures() {
    return `${GoogleAnalytics.GA_INIT_SCRIPT_CONTENT}
    ${GoogleAnalytics.GA_DISABLE_COOKIES}
    ${GoogleAnalytics.GA_IP_ANONYMIZATION}
    ${GoogleAnalytics.GA_DISABLE_ADVERTISING_FEATURES}
    ${GoogleAnalytics.GA_PAGE_VIEW}`;
  }

  private _communicate: string;
  private _gaLibrary: HTMLScriptElement;
  private _gaScript: HTMLScriptElement;
  private _gaScriptContent: Text;

  constructor() {
    this._onInit();
  }

  /**
   * Initializes Google Analytics scripts on merchants page.
   * Gathers all methods needed to establish GGoogle Analytics functionality.
   * @private
   */
  private _onInit() {
    this._insertGALibrary();
    this._createGAScript()
      .then(() => {
        this._insertGAScript()
          .then(() => {
            GoogleAnalytics._disableUserIDTracking();
          })
          .catch(error => {
            throw new Error(error);
          });
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  /**
   * Creates GA script, which is executed inside <script> markup.
   * Appends it in <script> tag.
   * @private
   */
  private _createGAScript() {
    return new Promise((resolve, reject) => {
      this._gaScript = document.createElement('script');
      this._gaScript.type = 'text/javascript';
      this._gaScriptContent = document.createTextNode(GoogleAnalytics._returnScriptWithFeatures());
      this._gaScript.appendChild(this._gaScriptContent);
      resolve((this._communicate = GoogleAnalytics.TRANSLATION_SCRIPT_SUCCEEDED));
      reject((this._communicate = GoogleAnalytics.TRANSLATION_SCRIPT_FAILED));
    });
  }

  /**
   * Inserts GA library after the GA script created by _createGAScript().
   * @private
   */
  private _insertGALibrary() {
    this._gaLibrary = DomMethods.insertScript('head', GoogleAnalytics.GA_SCRIPT_SRC);
    this._gaLibrary.async = true;
    document.head.appendChild(this._gaLibrary);
  }

  /**
   * Appends GA script if it has been successfully created by __createGAScript().
   * @private
   */
  private _insertGAScript() {
    return new Promise((resolve, reject) => {
      document.head.appendChild(this._gaScript);
      resolve((this._communicate = GoogleAnalytics.TRANSLATION_SCRIPT_APPENDED));
      reject((this._communicate = GoogleAnalytics.TRANSLATION_SCRIPT_APPENDED_FAILURE));
    });
  }
}

export default GoogleAnalytics;