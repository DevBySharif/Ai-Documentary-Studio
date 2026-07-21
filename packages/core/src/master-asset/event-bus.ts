import type { AssetEvent } from "./types.js";

export class AssetEventBus {
  private listeners = new Map<string, Set<(event: AssetEvent) => void>>();

  on(eventType: AssetEvent["type"], handler: (event: AssetEvent) => void): void {
    if (!this.listeners.has(eventType)) this.listeners.set(eventType, new Set());
    this.listeners.get(eventType)!.add(handler);
  }

  off(eventType: AssetEvent["type"], handler: (event: AssetEvent) => void): void {
    this.listeners.get(eventType)?.delete(handler);
  }

  emit(event: AssetEvent): void {
    const handlers = this.listeners.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        handler(event);
      }
    }
  }

  createEvent(type: AssetEvent["type"], assetId: string, payload: Record<string, unknown> = {}): AssetEvent {
    return {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      assetId,
      timestamp: new Date().toISOString(),
      payload
    };
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}
