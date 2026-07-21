type EventHandler = (payload: any) => void;

export class EventBus {
  private listeners: Map<string, EventHandler[]> = new Map();

  subscribe(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  publish(event: string, payload?: any) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((h) => h(payload));
    }
  }
}

export const mainEventBus = new EventBus();
