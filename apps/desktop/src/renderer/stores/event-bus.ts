import { DomainEvent } from "../../../../../packages/domain/src/events/domain-event";

type EventCallback = (event: DomainEvent) => void;

/**
 * Renderer-side Event Bus for cross-feature communication.
 */
export class UIEventBus {
  private listeners = new Map<string, Set<EventCallback>>();

  public publish(event: DomainEvent): void {
    const handlers = this.listeners.get(event.eventName);
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
    
    // Also notify wildcard listeners if implemented
    const catchAllHandlers = this.listeners.get("*");
    if (catchAllHandlers) {
      catchAllHandlers.forEach(handler => handler(event));
    }
  }

  public subscribe(eventName: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(callback);

    return () => {
      this.listeners.get(eventName)?.delete(callback);
    };
  }
}

export const eventBus = new UIEventBus();
