import type { AMEQSettings, AMLayerType } from "./types.js";

export class AMEqualizer {
  private bands: AMEQSettings = { sub: 0, low: 0, low_mid: 0, mid: 0, high_mid: 0, high: 0, enabled: false };

  configure(settings: Partial<AMEQSettings>): void {
    this.bands = { ...this.bands, ...settings };
  }

  getSettings(): AMEQSettings {
    return { ...this.bands };
  }

  setBand(band: keyof AMEQSettings, value: number): void {
    if (band === "enabled") return;
    this.bands[band] = Math.max(-12, Math.min(12, value));
  }

  enable(enabled: boolean): void {
    this.bands.enabled = enabled;
  }

  getNarrationDefaults(): AMEQSettings {
    return { sub: -1, low: -0.5, low_mid: 0, mid: 1, high_mid: 1.5, high: 2, enabled: true };
  }

  getMusicDefaults(): AMEQSettings {
    return { sub: 1, low: 0.5, low_mid: 0, mid: -0.5, high_mid: -0.5, high: 0, enabled: true };
  }

  getAmbienceDefaults(): AMEQSettings {
    return { sub: 0, low: 0, low_mid: 0, mid: -1, high_mid: -1, high: 0, enabled: true };
  }

  getDefaultsForLayer(type: AMLayerType): AMEQSettings {
    switch (type) {
      case "narration": return this.getNarrationDefaults();
      case "background_music": return this.getMusicDefaults();
      case "ambience": return this.getAmbienceDefaults();
      default: return { sub: 0, low: 0, low_mid: 0, mid: 0, high_mid: 0, high: 0, enabled: false };
    }
  }

  applyGentleCorrections(settings: AMEQSettings): AMEQSettings {
    return {
      sub: Math.max(-3, Math.min(3, settings.sub)),
      low: Math.max(-3, Math.min(3, settings.low)),
      low_mid: Math.max(-2, Math.min(2, settings.low_mid)),
      mid: Math.max(-2, Math.min(2, settings.mid)),
      high_mid: Math.max(-2, Math.min(2, settings.high_mid)),
      high: Math.max(-3, Math.min(3, settings.high)),
      enabled: settings.enabled
    };
  }

  reset(): void {
    this.bands = { sub: 0, low: 0, low_mid: 0, mid: 0, high_mid: 0, high: 0, enabled: false };
  }
}
