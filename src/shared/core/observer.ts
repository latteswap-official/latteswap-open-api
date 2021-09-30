import { defaultLogger } from '~/shared/core'

export interface ISubject {
  // Notify all observers about an event.
  notify(payload?: any): Promise<void>
}
/**
 * The Observer interface declares the update method, used by subjects.
 */
export interface IObserver {
  // Receive update from subject.
  update<T>(caller: ISubject, payload?: T): void
}

export class LoggerObserver implements IObserver {
  async update<T>(caller: ISubject, payload?: T): Promise<void> {
    defaultLogger.info(payload)
  }
}
