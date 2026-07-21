import type { FocusTarget } from "./types.js";

export class SubjectTracker {
  private currentTarget: FocusTarget | null = null;

  track(target: FocusTarget): void {
    this.currentTarget = target;
  }

  getCurrent(): FocusTarget | null {
    return this.currentTarget;
  }

  updatePosition(x: number, y: number): void {
    if (this.currentTarget) {
      this.currentTarget.x = x;
      this.currentTarget.y = y;
    }
  }

  isTracking(): boolean {
    return this.currentTarget !== null;
  }

  clear(): void {
    this.currentTarget = null;
  }
}
