import type { FSEventType } from "./types.js";

export class FSGlobalEventBus {
  private subscribers: Map<FSEventType, Array<(data: unknown) => void>> = new Map();
  private history: Array<{ type: FSEventType; data: unknown; frame: number }> = [];

  constructor() {
    const types: FSEventType[] = [
      "FrameStarted", "SceneEntered", "WordHighlighted", "CameraUpdated",
      "EffectTriggered", "FrameRendered", "SubtitleShown", "SubtitleHidden",
      "TransitionStarted", "TransitionEnded", "MotionStarted", "MotionEnded"
    ];
    for (const t of types) this.subscribers.set(t, []);
  }

  subscribe(type: FSEventType, cb: (data: unknown) => void): () => void {
    const list = this.subscribers.get(type);
    if (!list) return () => {};
    list.push(cb);
    return () => {
      const idx = list.indexOf(cb);
      if (idx >= 0) list.splice(idx, 1);
    };
  }

  publish(type: FSEventType, data: unknown, frame: number): void {
    this.history.push({ type, data, frame });
    const list = this.subscribers.get(type);
    if (list) {
      for (const cb of list) cb(data);
    }
  }

  getHistory(): Array<{ type: FSEventType; data: unknown; frame: number }> {
    return [...this.history];
  }

  getEventsOfType(type: FSEventType): Array<{ type: FSEventType; data: unknown; frame: number }> {
    return this.history.filter((e) => e.type === type);
  }

  clear(): void {
    this.history = [];
  }

  getEventCount(): number {
    return this.history.length;
  }
}
