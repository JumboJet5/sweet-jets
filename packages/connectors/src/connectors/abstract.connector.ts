import { BehaviorSubject, Observable } from 'rxjs'
import { ConnectResultEnum } from '../enum'
import { AbstractProvider } from '../types'

export abstract class AbstractConnector<P extends AbstractProvider | null = AbstractProvider | null, S = unknown> {
  protected abstract _state$: BehaviorSubject<S>

  protected constructor() {
  }

  public abstract connect(): Promise<ConnectResultEnum>

  public abstract disconnect(): Promise<void>

  /**
   * to subscribe on connector state changes
   */
  public getStateStreem(): Observable<S> {
    return this._state$.asObservable()
  }
}
