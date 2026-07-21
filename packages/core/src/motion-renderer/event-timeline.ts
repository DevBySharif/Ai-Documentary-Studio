import type { MRMotionEvent, MRMotionPreset } from "./types.js";

export class MRMotionEventTimeline {
  private events: MRMotionEvent[] = [];

  generate(preset: MRMotionPreset, startFrame: number, duration: number): MRMotionEvent[] {
    const events: MRMotionEvent[] = [
      { type: "start", frame: startFrame, preset, duration },
      { type: "peak", frame: startFrame + Math.floor(duration * 0.4), preset, duration },
      { type: "hold", frame: startFrame + Math.floor(duration * 0.6), preset, duration },
      { type: "transition", frame: startFrame + Math.floor(duration * 0.8), preset, duration },
      { type: "end", frame: startFrame + duration, preset, duration }
    ];
    this.events.push(...events);
    return events;
  }

  getEvents(): MRMotionEvent[] {
    return [...this.events];
  }

  getEventsInRange(startFrame: number, endFrame: number): MRMotionEvent[] {
    return this.events.filter((e) => e.frame >= startFrame && e.frame <= endFrame);
  }

  clear(): void {
    this.events = [];
  }
}
