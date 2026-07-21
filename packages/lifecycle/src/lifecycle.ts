import { ApplicationState, LifecycleEvent } from './models';
import pino from 'pino';

const logger = pino({ name: 'lifecycle-manager' });

/**
 * Manages the global state machine and broadcasts events.
 */
export class LifecycleManager {
  private currentState: ApplicationState = 'Bootstrapping';
  private eventHandlers = new Map<LifecycleEvent, Array<(data?: any) => void>>();

  /**
   * Transitions the application to a new state.
   */
  transition(newState: ApplicationState): void {
    logger.info({ from: this.currentState, to: newState }, 'Application State Transition');
    this.currentState = newState;
  }

  getState(): ApplicationState {
    return this.currentState;
  }

  /**
   * Broadcasts a lifecycle event to registered subsystems.
   */
  broadcast(event: LifecycleEvent, data?: any): void {
    logger.debug({ event }, 'Broadcasting Lifecycle Event');
    const handlers = this.eventHandlers.get(event) || [];
    
    // Execute handlers asynchronously so they don't block the caller
    handlers.forEach(handler => {
      setImmediate(() => {
        try {
          handler(data);
        } catch (err) {
          logger.error({ event, err }, 'Event handler threw an error');
        }
      });
    });
  }

  /**
   * Subscribes to a lifecycle event.
   */
  on(event: LifecycleEvent, handler: (data?: any) => void): void {
    const existing = this.eventHandlers.get(event) || [];
    this.eventHandlers.set(event, [...existing, handler]);
  }
}
