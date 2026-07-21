import type { FSScheduledEvent, FSEventType } from "./types.js";

export class FSEventScheduler {
  private events: FSScheduledEvent[] = [];
  private index = 0;

  schedule(type: string, frame: number, data: Record<string, unknown>): string {
    const id = `evt_${this.index++}_${frame}`;
    this.events.push({ id, type, frame, data });
    this.events.sort((a, b) => a.frame - b.frame);
    return id;
  }

  scheduleSceneStart(frame: number, scene: string): string {
    return this.schedule("SceneStart", frame, { scene });
  }

  scheduleSceneEnd(frame: number, scene: string): string {
    return this.schedule("SceneEnd", frame, { scene });
  }

  scheduleCameraMove(frame: number, target: Record<string, unknown>): string {
    return this.schedule("CameraMove", frame, { target });
  }

  scheduleSubtitleShow(frame: number, text: string): string {
    return this.schedule("SubtitleShow", frame, { text });
  }

  scheduleSubtitleHide(frame: number): string {
    return this.schedule("SubtitleHide", frame, {});
  }

  scheduleWordHighlight(frame: number, word: string): string {
    return this.schedule("WordHighlight", frame, { word });
  }

  scheduleTransition(frame: number, transitionType: string): string {
    return this.schedule("Transition", frame, { type: transitionType });
  }

  scheduleEffectStart(frame: number, effect: string): string {
    return this.schedule("EffectStart", frame, { effect });
  }

  scheduleEffectEnd(frame: number, effect: string): string {
    return this.schedule("EffectEnd", frame, { effect });
  }

  getEventsAtFrame(frame: number): FSScheduledEvent[] {
    return this.events.filter((e) => e.frame === frame);
  }

  getEventsInRange(startFrame: number, endFrame: number): FSScheduledEvent[] {
    return this.events.filter((e) => e.frame >= startFrame && e.frame <= endFrame);
  }

  getAllEvents(): FSScheduledEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
    this.index = 0;
  }

  getEventCount(): number {
    return this.events.length;
  }
}
