import type { AMZennProfile, AMEQSettings, AMCompressorSettings, AMMusicDuckingSettings } from "./types.js";

export class AMZennAudioProfile {
  private profile: AMZennProfile = {
    narration: { warm: true, natural: true },
    music: { soft: true, cinematic: true },
    ambience: { subtle: true },
    ducking: { gentle: true, automatic: true },
    compression: { minimal: true },
    eq: { clean: true },
    overall: { comfortable: true, longForm: true }
  };

  getProfile(): AMZennProfile {
    return { ...this.profile };
  }

  getNarrationEQ(): AMEQSettings {
    return { sub: -1, low: -1, low_mid: 0.5, mid: 1.5, high_mid: 1, high: 1.5, enabled: true };
  }

  getMusicEQ(): AMEQSettings {
    return { sub: 0.5, low: 0, low_mid: -0.5, mid: -1, high_mid: -0.5, high: 0, enabled: true };
  }

  getNarrationCompressor(): AMCompressorSettings {
    return { threshold: -16, ratio: 2, attack: 10, release: 150, makeupGain: 1, enabled: true };
  }

  getDuckingSettings(): AMMusicDuckingSettings {
    return { threshold: -22, reduction: 8, attack: 80, release: 300, enabled: true };
  }

  getDefaultVolumeBalance(): { narration: number; music: number; ambience: number; effects: number } {
    return { narration: -2, music: -12, ambience: -18, effects: -10 };
  }

  isLongFormOptimized(): boolean {
    return this.profile.overall.longForm;
  }

  isComfortable(): boolean {
    return this.profile.overall.comfortable;
  }
}
