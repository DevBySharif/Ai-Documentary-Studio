import type { EEFramerate } from "./types.js";

export class EEFrameRateProfiles {
  private readonly rates: EEFramerate[] = [24, 25, 30, 50, 60];

  isValid(fps: number): fps is EEFramerate {
    return this.rates.includes(fps as EEFramerate);
  }

  getRates(): EEFramerate[] {
    return [...this.rates];
  }

  getDefault(): EEFramerate {
    return 30;
  }
}
