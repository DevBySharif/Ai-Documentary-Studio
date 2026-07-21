import { DomainEvent } from './domain-event';

export type EventHandler = (event: DomainEvent) => void | Promise<void>;

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe(eventName: string, handler: EventHandler): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  async publish(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.name) || [];
    
    // Fire and forget style for loose coupling
    Promise.all(eventHandlers.map(handler => handler(event)))
      .catch(err => console.error(`Error handling event ${event.name}:`, err));
  }
}
