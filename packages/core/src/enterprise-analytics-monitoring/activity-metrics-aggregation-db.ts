export interface OperationalActivityEvent {
  readonly eventId: string;
  readonly eventName: string;
  readonly userId: string;
  readonly projectId?: string;
  readonly payloadJson: string;
  readonly timestamp: Date;
}

/**
 * Activity Event Collector & Aggregation Engine (Vol 08 Part 06 - Section 3, Section 11).
 * Ingests operational events and aggregates raw telemetry into structured analytics records.
 */
export class ActivityMetricsAggregationDb {
  private events: OperationalActivityEvent[] = [];

  public logOperationalEvent(eventName: string, userId: string, payloadObj: unknown, projectId?: string): OperationalActivityEvent {
    const event: OperationalActivityEvent = {
      eventId: `evt_op_${Math.random().toString(36).substring(2, 7)}`,
      eventName,
      userId,
      projectId,
      payloadJson: JSON.stringify(payloadObj),
      timestamp: new Date(),
    };

    this.events.push(event);
    return event;
  }

  public getEventsForProject(projectId: string): ReadonlyArray<OperationalActivityEvent> {
    return this.events.filter((e) => e.projectId === projectId);
  }
}
