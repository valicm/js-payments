import { Container } from 'typedi';
import { IStyles } from '../../shared/model/config/IStyles';
import { ConfigProvider } from '../../application/core/services/ConfigProvider';
import { IConfig } from '../../shared/model/config/IConfig';

export abstract class RegisterFrames {
  protected styles: IStyles;
  protected config: IConfig;
  protected elementsToRegister: HTMLElement[];
  protected elementsTargets: string[];

  protected constructor() {
    const configProvider = Container.get(ConfigProvider);
    this.config = configProvider.getConfig();
    this.styles = this._getStyles(this.config.styles);
  }

  protected abstract registerElements(fields: HTMLElement[], targets: string[]): void;

  protected abstract setElementsFields(): string[];

  private _getStyles(styles: any): IStyles {
    for (const key in styles) {
      if (styles[key] instanceof Object) {
        return styles;
      }
    }
    styles = { defaultStyles: styles };
    return styles;
  }
}
