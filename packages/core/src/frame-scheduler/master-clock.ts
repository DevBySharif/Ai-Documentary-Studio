import type { FSClockSnapshot, FSFramerate } from "./types.js";

export class FSMasterClock {
  private clock: FSClockSnapshot = { frame: 0, timestamp: 0, fps: 30, sceneId: "scene_0", running: false };
  private subscribers: Array<(clock: FSClockSnapshot) => void> = [];

  start(): void {
    this.clock.running = true;
    this.clock.frame = 0;
    this.clock.timestamp = 0;
  }

  stop(): void {
    this.clock.running = false;
  }

  tick(): FSClockSnapshot {
    if (!this.clock.running) return this.getState();
    this.clock.frame++;
    this.clock.timestamp = (this.clock.frame / this.clock.fps) * 1000;
    this.notify();
    return this.getState();
  }

  setFPS(fps: FSFramerate): void {
    this.clock.fps = fps;
  }

  setScene(sceneId: string): void {
    this.clock.sceneId = sceneId;
  }

  getState(): FSClockSnapshot {
    return { ...this.clock };
  }

  getCurrentFrame(): number {
    return this.clock.frame;
  }

  getCurrentTime(): number {
    return this.clock.timestamp;
  }

  frameToTime(frame: number): number {
    return (frame / this.clock.fps) * 1000;
  }

  timeToFrame(ms: number): number {
    return Math.round((ms / 1000) * this.clock.fps);
  }

  subscribe(cb: (clock: FSClockSnapshot) => void): void {
    this.subscribers.push(cb);
  }

  private notify(): void {
    const state = this.getState();
    for (const cb of this.subscribers) cb(state);
  }

  isRunning(): boolean {
    return this.clock.running;
  }

  reset(): void {
    this.clock = { frame: 0, timestamp: 0, fps: 30, sceneId: "scene_0", running: false };
  }
}
