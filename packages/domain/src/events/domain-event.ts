/**
 * Represents a business event that has occurred in the domain.
 * Domain events describe facts that have already occurred.
 */
export interface DomainEvent<TPayload = unknown> {
  readonly id: string;
  readonly eventName: string;
  readonly occurredOn: Date;
  readonly aggregateId?: string;
  readonly correlationId?: string;
  readonly source: string;
  readonly schemaVersion: number;
  readonly payload: TPayload;
}
