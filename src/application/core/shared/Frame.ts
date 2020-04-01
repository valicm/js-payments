import { IAllowedStyles } from '../models/IAllowedStyles';
import { IParams } from '../models/IParams';
import { IStyle } from '../../../shared/model/config/IStyle';
import { MessageBus } from './MessageBus';
import { Styler } from './Styler';
import { Container } from 'typedi';
import { FramesHub } from '../../../shared/services/message-bus/FramesHub';
import './OverrideDomain';

export class Frame {
  protected messageBus: MessageBus = Container.get(MessageBus);
  protected params: IParams;

  public parseUrl() {
    const parsedUrl = new URL(window.location.href);
    const styles: IStyle = {};
    const params: IParams = {};
    const allowedParams = this.getAllowedParams();
    parsedUrl.searchParams.forEach((value, param) => {
      if (allowedParams.includes(param)) {
        params[param] = value;
      } else {
        styles[param] = value;
      }
    });
    // @ts-ignore
    params.styles = styles;
    return params;
  }

  public applyStyles() {
    new Styler(this.getAllowedStyles()).inject(this.params.styles);
  }

  protected onInit() {
    this.params = this.parseUrl();
    this.applyStyles();

    Container.get(FramesHub).notifyReadyState();
  }

  protected getAllowedParams() {
    return ['locale', 'origin'];
  }

  protected getAllowedStyles() {
    const allowed: IAllowedStyles = {
      'background-color-body': { property: 'background-color', selector: 'body' },
      'color-body': { property: 'color', selector: 'body' },
      'font-size-body': { property: 'font-size', selector: 'body' },
      'line-height-body': { property: 'line-height', selector: 'body' },
      'space-inset-body': { property: 'padding', selector: 'body' },
      'space-outset-body': { property: 'margin', selector: 'body' }
    };
    return allowed;
  }
}