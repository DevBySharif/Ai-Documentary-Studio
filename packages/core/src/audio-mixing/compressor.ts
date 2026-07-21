import type { AMCompressorSettings } from "./types.js";

export class AMCompressor {
  private settings: AMCompressorSettings = { threshold: -20, ratio: 3, attack: 5, release: 100, makeupGain: 0, enabled: false };

  configure(settings: Partial<AMCompressorSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  getSettings(): AMCompressorSettings {
    return { ...this.settings };
  }

  process(inputLevel: number): number {
    if (!this.settings.enabled) return inputLevel;

    if (inputLevel < this.settings.threshold) return inputLevel;

    const excess = inputLevel - this.settings.threshold;
    const compressed = excess / this.settings.ratio;

    return this.settings.threshold + compressed + this.settings.makeupGain;
  }

  getNarrationDefaults(): AMCompressorSettings {
    return { threshold: -18, ratio: 2.5, attack: 8, release: 120, makeupGain: 1, enabled: true };
  }

  getMusicDefaults(): AMCompressorSettings {
    return { threshold: -22, ratio: 3, attack: 5, release: 80, makeupGain: 0, enabled: true };
  }

  applyGentleCompression(settings: AMCompressorSettings): AMCompressorSettings {
    return {
      threshold: Math.max(-30, Math.min(-10, settings.threshold)),
      ratio: Math.max(1.5, Math.min(4, settings.ratio)),
      attack: Math.max(3, Math.min(20, settings.attack)),
      release: Math.max(50, Math.min(300, settings.release)),
      makeupGain: Math.max(0, Math.min(3, settings.makeupGain)),
      enabled: settings.enabled
    };
  }

  reset(): void {
    this.settings = { threshold: -20, ratio: 3, attack: 5, release: 100, makeupGain: 0, enabled: false };
  }
}
