import type { AMLimiterSettings } from "./types.js";

export class AMLimiter {
  private settings: AMLimiterSettings = { ceiling: -1, attack: 2, release: 50, enabled: true };

  configure(settings: Partial<AMLimiterSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  getSettings(): AMLimiterSettings {
    return { ...this.settings };
  }

  process(sample: number): number {
    if (!this.settings.enabled) return sample;

    const ceiling = this.settings.ceiling;

    if (sample <= ceiling) return sample;

    return ceiling;
  }

  detectClipping(samples: number[], threshold: number): number {
    return samples.filter((s) => s > threshold).length;
  }

  getDefaultSettings(): AMLimiterSettings {
    return { ceiling: -1, attack: 2, release: 50, enabled: true };
  }

  reset(): void {
    this.settings = this.getDefaultSettings();
  }
}
