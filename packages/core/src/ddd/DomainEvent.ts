/**
 * Base interface for all Domain Events.
 */
export interface DomainEvent {
  readonly dateTimeOccurred: Date;
  readonly aggregateId: string;
  readonly getAggregateId: () => string;
}
