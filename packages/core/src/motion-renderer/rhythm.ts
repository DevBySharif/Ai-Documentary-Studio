import type { MRMotionPreset, MRCameraRhythmReport } from "./types.js";

export class MRCameraRhythmEngine {
  private history: Array<{ shotLength: number; direction: number; zoom: number; preset: MRMotionPreset }> = [];

  record(shotLength: number, direction: number, zoom: number, preset: MRMotionPreset): void {
    this.history.push({ shotLength, direction, zoom, preset });
  }

  analyze(totalScenes: number): MRCameraRhythmReport {
    if (this.history.length === 0) {
      return { averageShotLength: 0, directionChanges: 0, zoomFrequency: 0, motionIntensity: 0, viewerFatigueScore: 0, isRepetitive: false };
    }

    const avgShotLength = this.history.reduce((s, h) => s + h.shotLength, 0) / this.history.length;
    let directionChanges = 0;
    for (let i = 1; i < this.history.length; i++) {
      const diff = Math.abs(this.history[i].direction - this.history[i - 1].direction);
      if (diff > 45) directionChanges++;
    }

    const zooms = this.history.filter((h) => h.preset.includes("push") || h.preset.includes("zoom"));
    const zoomFrequency = zooms.length / Math.max(1, this.history.length);

    const motionIntensity = this.history.reduce((s, h) => {
      const isActive = !["hold", "micro_motion"].includes(h.preset);
      return s + (isActive ? 1 : 0);
    }, 0) / Math.max(1, this.history.length);

    const fatigue = (zoomFrequency * 30 + motionIntensity * 40 + directionChanges * 10) / Math.max(1, totalScenes);
    const isRepetitive = this.history.length >= 4 && new Set(this.history.slice(-4).map((h) => h.preset)).size <= 2;

    return {
      averageShotLength: Math.round(avgShotLength * 10) / 10,
      directionChanges,
      zoomFrequency: Math.round(zoomFrequency * 100) / 100,
      motionIntensity: Math.round(motionIntensity * 100) / 100,
      viewerFatigueScore: Math.min(100, Math.round(fatigue)),
      isRepetitive
    };
  }

  suggestNextPreset(): MRMotionPreset {
    const lastPreset = this.history[this.history.length - 1]?.preset;
    const alternates: MRMotionPreset[] = ["push_in", "pan_right", "hold", "push_out", "pan_left", "micro_motion"];

    if (!lastPreset) return "hold";
    const lastIdx = alternates.indexOf(lastPreset);
    const nextIdx = (lastIdx + 2) % alternates.length;
    return alternates[nextIdx];
  }

  reset(): void {
    this.history = [];
  }
}
