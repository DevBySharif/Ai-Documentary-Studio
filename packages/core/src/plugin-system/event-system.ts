import { PLPluginEventType } from './types';

type EventHandler = (data: unknown) => void;

export class PLPluginEventSystem {
  private subscriptions = new Map<PLPluginEventType, Map<string, EventHandler[]>>();

  subscribe(pluginId: string, eventType: PLPluginEventType, handler: EventHandler): void {
    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, new Map());
    }
    const eventSubs = this.subscriptions.get(eventType)!;
    if (!eventSubs.has(pluginId)) {
      eventSubs.set(pluginId, []);
    }
    eventSubs.get(pluginId)!.push(handler);
  }

  unsubscribe(pluginId: string, eventType: PLPluginEventType): void {
    const eventSubs = this.subscriptions.get(eventType);
    if (eventSubs) {
      eventSubs.delete(pluginId);
    }
  }

  emit(eventType: PLPluginEventType, data: unknown): void {
    const eventSubs = this.subscriptions.get(eventType);
    if (!eventSubs) return;
    for (const [, handlers] of eventSubs) {
      for (const handler of handlers) {
        try {
          handler(data);
        } catch {
          // Silently handle subscriber errors
        }
      }
    }
  }

  getSubscribers(eventType: PLPluginEventType): string[] {
    const eventSubs = this.subscriptions.get(eventType);
    if (!eventSubs) return [];
    return Array.from(eventSubs.keys());
  }
}
