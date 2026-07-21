import type { MRMotionLimit } from "./types.js";

export class MRMotionLimiter {
  private config: MRMotionLimit = { maxZoom: 2.5, maxPanSpeed: 5, maxRotation: 15, minHoldFrames: 30 };

  configure(config: Partial<MRMotionLimit>): void {
    this.config = { ...this.config, ...config };
  }

  limitZoom(zoom: number): number {
    return Math.max(1, Math.min(this.config.maxZoom, zoom));
  }

  limitPanSpeed(dx: number, dy: number): { dx: number; dy: number } {
    const speed = Math.sqrt(dx * dx + dy * dy);
    if (speed > this.config.maxPanSpeed) {
      const scale = this.config.maxPanSpeed / speed;
      return { dx: dx * scale, dy: dy * scale };
    }
    return { dx, dy };
  }

  limitRotation(rotation: number): number {
    return Math.max(-this.config.maxRotation, Math.min(this.config.maxRotation, rotation));
  }

  checkHoldDuration(frames: number): { valid: boolean; message?: string } {
    if (frames < this.config.minHoldFrames) {
      return { valid: false, message: `Hold too short: ${frames} < ${this.config.minHoldFrames}` };
    }
    return { valid: true };
  }
}
