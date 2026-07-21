import type { FSTransitionType } from "./types.js";

export class FSTransitionScheduler {
  private activeTransitions: Map<string, { type: FSTransitionType; startFrame: number; endFrame: number }> = new Map();

  schedule(type: FSTransitionType, startFrame: number, durationFrames: number): string {
    const id = `transition_${startFrame}_${type}`;
    this.activeTransitions.set(id, { type, startFrame, endFrame: startFrame + durationFrames });
    return id;
  }

  scheduleCrossfade(startFrame: number, durationFrames: number): string {
    return this.schedule("crossfade", startFrame, durationFrames);
  }

  scheduleDipToBlack(startFrame: number, durationFrames: number): string {
    return this.schedule("dip_to_black", startFrame, durationFrames);
  }

  scheduleLightFade(startFrame: number, durationFrames: number): string {
    return this.schedule("light_fade", startFrame, durationFrames);
  }

  scheduleBlur(startFrame: number, durationFrames: number): string {
    return this.schedule("blur", startFrame, durationFrames);
  }

  scheduleMotionMatch(startFrame: number, durationFrames: number): string {
    return this.schedule("motion_match", startFrame, durationFrames);
  }

  getActiveAtFrame(frame: number): Array<{ type: FSTransitionType; progress: number }> {
    const active: Array<{ type: FSTransitionType; progress: number }> = [];
    for (const [, t] of this.activeTransitions) {
      if (frame >= t.startFrame && frame <= t.endFrame) {
        const progress = (frame - t.startFrame) / (t.endFrame - t.startFrame);
        active.push({ type: t.type, progress });
      }
    }
    return active;
  }

  clearCompleted(frame: number): void {
    for (const [id, t] of this.activeTransitions) {
      if (frame > t.endFrame) this.activeTransitions.delete(id);
    }
  }

  hasOverlap(): boolean {
    const sorted = Array.from(this.activeTransitions.values()).sort((a, b) => a.startFrame - b.startFrame);
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].endFrame > sorted[i + 1].startFrame) return true;
    }
    return false;
  }

  clearAll(): void {
    this.activeTransitions.clear();
  }
}
