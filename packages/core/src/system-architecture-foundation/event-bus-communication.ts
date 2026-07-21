import { DomainEvent, LayerType } from "./architecture-types";

export type EventCallback<T = unknown> = (event: DomainEvent<T>) => void;

/**
 * Event-Driven Communication Bus (Vol 06 Part 01 - Section 3).
 * Decouples engine interactions through asynchronous domain events (ScriptApproved -> StoryboardEngine -> AssetsGenerated -> TimelineEngine).
 */
export class EventBusCommunication {
  private subscribers = new Map<string, EventCallback[]>();

  public subscribe<T = unknown>(eventName: string, callback: EventCallback<T>): void {
    const existing = this.subscribers.get(eventName) || [];
    this.subscribers.set(eventName, [...existing, callback as EventCallback]);
  }

  public publish<T = unknown>(eventName: string, publisherLayer: LayerType, payload: T): DomainEvent<T> {
    const event: DomainEvent<T> = {
      eventId: `evt_${Math.random().toString(36).substring(2, 7)}`,
      eventName,
      publisherLayer,
      payload,
      publishedAt: new Date(),
    };

    const callbacks = this.subscribers.get(eventName) || [];
    callbacks.forEach((cb) => cb(event));
    return event;
  }
}
