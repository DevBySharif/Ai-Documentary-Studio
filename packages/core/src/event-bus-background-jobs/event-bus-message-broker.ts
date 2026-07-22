import { EventBusMessage } from "./job-event-types";

/**
 * Immutable Event Bus & Message Broker Queue Manager (Vol 09 Part 03 - Section 4, Section 5).
 * Distributes immutable platform events (`ProjectCreated`, `ScriptGenerated`, `ExportFinished`) and manages message delivery queues.
 */
export class EventBusMessageBroker {
  private eventsLog: EventBusMessage[] = [];
  private eventListeners = new Map<string, Array<(msg: EventBusMessage) => void>>();

  public publishEvent(eventName: string, publisherId: string, payloadObj: unknown): EventBusMessage {
    const msg: EventBusMessage = {
      eventId: `evt_bus_${Math.random().toString(36).substring(2, 7)}`,
      eventName,
      publisherId,
      payloadJson: JSON.stringify(payloadObj),
      publishedAt: new Date(),
    };

    this.eventsLog.push(msg);

    const listeners = this.eventListeners.get(eventName) || [];
    listeners.forEach((fn) => fn(msg));

    return msg;
  }

  public subscribeToEvent(eventName: string, handler: (msg: EventBusMessage) => void): void {
    const existing = this.eventListeners.get(eventName) || [];
    this.eventListeners.set(eventName, [...existing, handler]);
  }
}
