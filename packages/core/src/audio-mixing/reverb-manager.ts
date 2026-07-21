import type { AMReverbSettings, AMReverbType } from "./types.js";

export class AMReverbManager {
  private settings: AMReverbSettings = { type: "none", mix: 0, decay: 0, preDelay: 0, enabled: false };

  private presets: Record<AMReverbType, AMReverbSettings> = {
    none: { type: "none", mix: 0, decay: 0, preDelay: 0, enabled: false },
    room: { type: "room", mix: 0.15, decay: 0.3, preDelay: 10, enabled: true },
    hall: { type: "hall", mix: 0.25, decay: 0.7, preDelay: 20, enabled: true },
    plate: { type: "plate", mix: 0.2, decay: 0.5, preDelay: 5, enabled: true },
    chamber: { type: "chamber", mix: 0.18, decay: 0.4, preDelay: 8, enabled: true }
  };

  configure(settings: Partial<AMReverbSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  getSettings(): AMReverbSettings {
    return { ...this.settings };
  }

  setType(type: AMReverbType): void {
    const preset = this.presets[type];
    if (preset) this.settings = { ...preset };
  }

  getPreset(type: AMReverbType): AMReverbSettings {
    return { ...this.presets[type] };
  }

  enable(enabled: boolean): void {
    this.settings.enabled = enabled;
  }

  isActive(): boolean {
    return this.settings.enabled && this.settings.type !== "none" && this.settings.mix > 0;
  }
}
