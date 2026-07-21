import type { AMMusicDuckingSettings } from "./types.js";

export class AMMusicDuckingEngine {
  private settings: AMMusicDuckingSettings = { threshold: -20, reduction: 10, attack: 50, release: 200, enabled: true };

  configure(settings: Partial<AMMusicDuckingSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  getSettings(): AMMusicDuckingSettings {
    return { ...this.settings };
  }

  calculateGain(narrationLevel: number, isSpeaking: boolean, elapsed: number): number {
    if (!this.settings.enabled) return 0;

    if (!isSpeaking) return this.recoverGain(elapsed);

    if (narrationLevel < this.settings.threshold) return this.recoverGain(elapsed);

    return -this.settings.reduction;
  }

  private recoverGain(elapsed: number): number {
    const recoveryTime = this.settings.release;
    const t = Math.min(elapsed / recoveryTime, 1);
    return -this.settings.reduction * (1 - t);
  }

  applyDucking(musicVolume: number, duckGain: number): number {
    return musicVolume + duckGain;
  }
}
