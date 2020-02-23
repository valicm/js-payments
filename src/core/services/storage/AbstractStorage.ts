import { IStorage } from '../../models/IStorage';
import { fromEventPattern, Observable, Subscribable } from 'rxjs';
import { map, shareReplay, startWith, takeUntil } from 'rxjs/operators';
import { InterFrameCommunicator } from '../message-bus/InterFrameCommunicator';
import { ofType } from '../message-bus/operators/ofType';
import { FramesHub } from '../message-bus/FramesHub';
import { Selectors } from '../../shared/Selectors';
import { IMessageBusEvent } from '../../models/IMessageBusEvent';

export abstract class AbstractStorage implements IStorage, Subscribable<any> {
  private static readonly STORAGE_EVENT = 'storage';
  public readonly pipe: Observable<any>['pipe'];
  public readonly subscribe: Observable<any>['subscribe'];
  private readonly observable$: Observable<any>;

  protected constructor(
    private nativeStorage: Storage,
    private communicator: InterFrameCommunicator,
    private framesHub: FramesHub,
  ) {
    this.observable$ = fromEventPattern(
      handler => window.addEventListener(AbstractStorage.STORAGE_EVENT, handler, true),
      handler => window.removeEventListener(AbstractStorage.STORAGE_EVENT, handler)
    ).pipe(
      startWith({...this.nativeStorage}),
      map(() => ({...this.nativeStorage})),
      shareReplay(1),
    );
    this.pipe = this.observable$.pipe.bind(this.observable$);
    this.subscribe = this.observable$.subscribe.bind(this.observable$);

    this.communicator.incomingEvent$.pipe(
      ofType(this.SET_ITEM_EVENT),
      takeUntil(this.communicator.communicationClosed$),
    ).subscribe(event => {
      const {key, value} = event.data;
      this.nativeStorage.setItem(key, value);
      this.emitStorageEvent();
    });
  }

  public getItem(name: string): string {
    return this.nativeStorage.getItem(name);
  }

  public setItem(name: string, value: string): void {
    this.nativeStorage.setItem(name, value);
    this.emitStorageEvent();
    this.synchronizeStorage(name, value);
  }

  public select<T>(selector: ((storage: {[key: string]: any}) => T)): Observable<T> {
    return this.observable$.pipe(
      map(storage => selector(storage)),
    );
  }

  protected abstract get SET_ITEM_EVENT(): string;

  private emitStorageEvent(): void {
    const event = document.createEvent('StorageEvent');
    event.initEvent(AbstractStorage.STORAGE_EVENT, true, true);
    window.dispatchEvent(event);
  }

  private synchronizeStorage(key: string, value: string): void {
    const event: IMessageBusEvent = {
      type: this.SET_ITEM_EVENT,
      data: {key, value},
    };

    if (window.name) {
      return this.communicator.send(event);
    }

    this.framesHub
      .waitForFrame(Selectors.CONTROL_FRAME_IFRAME)
      .subscribe(controlFrame => this.communicator.send(event, controlFrame));
  }
}
