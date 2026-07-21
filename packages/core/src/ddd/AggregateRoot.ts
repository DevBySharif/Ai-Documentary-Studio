import { Entity } from './Entity';
import { DomainEvent } from './DomainEvent';

/**
 * Base class for Aggregate Roots.
 * Tracks domain events and optimistic concurrency versions.
 */
export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: DomainEvent[] = [];
  private _version: number = 0;

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  get version(): number {
    return this._version;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  public incrementVersion(): void {
    this._version++;
  }
}
