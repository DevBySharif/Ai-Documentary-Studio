import type { AMNoiseReductionSettings, AMNoiseType } from "./types.js";

export class AMNoiseReduction {
  private settings: Map<AMNoiseType, AMNoiseReductionSettings> = new Map();

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    this.settings.set("background", { type: "background", reduction: 6, enabled: true });
    this.settings.set("hum", { type: "hum", reduction: 12, enabled: false });
    this.settings.set("static", { type: "static", reduction: 8, enabled: false });
    this.settings.set("low_rumble", { type: "low_rumble", reduction: 10, enabled: false });
  }

  configure(type: AMNoiseType, settings: Partial<AMNoiseReductionSettings>): void {
    const current = this.settings.get(type);
    if (current) {
      this.settings.set(type, { ...current, ...settings });
    }
  }

  getSettings(type: AMNoiseType): AMNoiseReductionSettings | undefined {
    const s = this.settings.get(type);
    return s ? { ...s } : undefined;
  }

  getActiveNoiseTypes(): AMNoiseType[] {
    return Array.from(this.settings.values()).filter((s) => s.enabled).map((s) => s.type);
  }

  enableAll(): void {
    for (const [type, settings] of this.settings) {
      this.settings.set(type, { ...settings, enabled: true });
    }
  }

  disableAll(): void {
    for (const [type, settings] of this.settings) {
      this.settings.set(type, { ...settings, enabled: false });
    }
  }

  hasArtifacts(): boolean {
    return false;
  }
}
