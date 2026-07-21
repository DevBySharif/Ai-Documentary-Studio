import { PDEventStoreEntry } from "./types";
import { PDUniqueIdentifiers } from "./unique-identifiers";

export class PDEventStore {
  private events: PDEventStoreEntry[] = [];
  private uids = new PDUniqueIdentifiers();
  private listeners = new Map<string, ((entry: PDEventStoreEntry) => void)[]>();

  recordEvent(eventType: string, entityId: string, data: Record<string, unknown>): void {
    const version = this.events.filter((e) => e.entityId === entityId).length + 1;
    const entry: PDEventStoreEntry = {
      id: this.uids.generateUUID(),
      eventType,
      entityId,
      data,
      timestamp: new Date(),
      version,
    };
    this.events.push(entry);

    const typeListeners = this.listeners.get(eventType);
    if (typeListeners) {
      for (const listener of typeListeners) {
        listener(entry);
      }
    }
  }

  getEvents(entityId: string): PDEventStoreEntry[] {
    return this.events.filter((e) => e.entityId === entityId);
  }

  getEventsByType(eventType: string): PDEventStoreEntry[] {
    return this.events.filter((e) => e.eventType === eventType);
  }

  replayEvents(entityId: string): void {
    const entityEvents = this.getEvents(entityId);
    for (const event of entityEvents) {
      const typeListeners = this.listeners.get(event.eventType);
      if (typeListeners) {
        for (const listener of typeListeners) {
          listener(event);
        }
      }
    }
  }

  getEventStream(sinceTimestamp: Date): PDEventStoreEntry[] {
    return this.events.filter((e) => e.timestamp >= sinceTimestamp);
  }
}
