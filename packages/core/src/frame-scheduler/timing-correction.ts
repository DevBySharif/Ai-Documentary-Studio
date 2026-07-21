import type { FSTimingCorrection, FSDriftType } from "./types.js";

export class FSTimingCorrectionEngine {
  private driftLog: FSTimingCorrection[] = [];

  detect(frame: number, expectedFrame: number, type: FSDriftType): FSTimingCorrection {
    const framesDrifted = Math.abs(frame - expectedFrame);
    const autoFixed = framesDrifted <= 2;

    const correction: FSTimingCorrection = {
      driftType: type,
      framesDrifted,
      correctionApplied: autoFixed ? framesDrifted : 0,
      autoFixed
    };

    this.driftLog.push(correction);
    return correction;
  }

  compensate(drift: FSTimingCorrection): number {
    if (drift.autoFixed) return 0;
    return drift.framesDrifted;
  }

  autoCorrect(frame: number, expectedFrame: number): number {
    const drift = frame - expectedFrame;
    if (Math.abs(drift) <= 2) return expectedFrame;
    return frame;
  }

  getDriftLog(): FSTimingCorrection[] {
    return [...this.driftLog];
  }

  getRecentDrifts(count: number): FSTimingCorrection[] {
    return this.driftLog.slice(-count);
  }

  hasPersistentDrift(): boolean {
    if (this.driftLog.length < 5) return false;
    const recent = this.driftLog.slice(-5);
    return recent.every((d) => !d.autoFixed);
  }

  clear(): void {
    this.driftLog = [];
  }
}
