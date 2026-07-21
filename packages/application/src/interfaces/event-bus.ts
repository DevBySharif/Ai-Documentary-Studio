import { DomainEvent } from "../../../domain/src/events/domain-event";

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
  subscribe<TEvent extends DomainEvent>(
    eventName: string,
    handler: (event: TEvent) => Promise<void>
  ): void;
}
