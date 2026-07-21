import type { MRMotionPreset } from "./types.js";

export class MRMotionTypeRegistry {
  private presets = new Map<MRMotionPreset, { description: string; defaultDuration: number; configurable: boolean }>();

  constructor() {
    this.registerAll();
  }

  private registerAll(): void {
    const all: Array<{ type: MRMotionPreset; desc: string; dur: number }> = [
      { type: "push_in", desc: "Slow zoom into subject", dur: 6 },
      { type: "push_out", desc: "Slow zoom away from subject", dur: 6 },
      { type: "pan_left", desc: "Horizontal pan left", dur: 4 },
      { type: "pan_right", desc: "Horizontal pan right", dur: 4 },
      { type: "tilt_up", desc: "Vertical tilt upward", dur: 4 },
      { type: "tilt_down", desc: "Vertical tilt downward", dur: 4 },
      { type: "orbit", desc: "Orbital rotation around subject", dur: 8 },
      { type: "parallax", desc: "Multi-layer depth movement", dur: 6 },
      { type: "reveal", desc: "Slow reveal of subject", dur: 5 },
      { type: "drift", desc: "Gentle floating movement", dur: 7 },
      { type: "hold", desc: "Static camera hold", dur: 4 },
      { type: "micro_motion", desc: "Subtle micro movement", dur: 3 }
    ];
    for (const p of all) {
      this.presets.set(p.type, { description: p.desc, defaultDuration: p.dur, configurable: true });
    }
  }

  get(type: MRMotionPreset): { description: string; defaultDuration: number; configurable: boolean } | undefined {
    return this.presets.get(type);
  }

  getAll(): MRMotionPreset[] {
    return Array.from(this.presets.keys());
  }

  getDefaultDuration(type: MRMotionPreset): number {
    return this.presets.get(type)?.defaultDuration ?? 4;
  }
}
