import { DomainEvent } from './DomainEvent';
import { AggregateRoot } from './AggregateRoot';

type DomainEventHandler = (event: DomainEvent) => void | Promise<void>;

/**
 * Centralized dispatcher for Domain Events.
 * Dispatches events accumulated by Aggregate Roots.
 */
export class DomainEventDispatcher {
  private static handlersMap: Map<string, DomainEventHandler[]> = new Map();

  public static register(eventName: string, handler: DomainEventHandler): void {
    if (!this.handlersMap.has(eventName)) {
      this.handlersMap.set(eventName, []);
    }
    this.handlersMap.get(eventName)!.push(handler);
  }

  public static clearHandlers(): void {
    this.handlersMap.clear();
  }

  public static async dispatchEventsForAggregate(aggregate: AggregateRoot<any>): Promise<void> {
    const events = aggregate.domainEvents.slice();
    aggregate.clearEvents();

    for (const event of events) {
      await this.dispatch(event);
    }
  }

  private static async dispatch(event: DomainEvent): Promise<void> {
    const eventName = event.constructor.name;
    const handlers = this.handlersMap.get(eventName);

    if (handlers) {
      for (const handler of handlers) {
        await handler(event);
      }
    }
  }
}
