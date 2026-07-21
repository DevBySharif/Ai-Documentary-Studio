import type { AIntDuckingConfig } from "./types.js";

export class AIntBackgroundMusicDucker {
  private config: AIntDuckingConfig = { reductionDb: 12, attackMs: 50, releaseMs: 200, thresholdDb: -30 };

  configure(config: Partial<AIntDuckingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): AIntDuckingConfig {
    return { ...this.config };
  }

  duck(narrationSegments: Array<{ start: number; end: number }>, musicLevels: number[], sampleRate: number): number[] {
    const ducked = [...musicLevels];
    for (const seg of narrationSegments) {
      const startSample = Math.floor(seg.start * sampleRate);
      const endSample = Math.floor(seg.end * sampleRate);
      const attackSamples = Math.floor(this.config.attackMs * sampleRate / 1000);
      const releaseSamples = Math.floor(this.config.releaseMs * sampleRate / 1000);

      for (let i = startSample; i < endSample && i < ducked.length; i++) {
        const progress = i - startSample;
        const factor = progress < attackSamples
          ? 1 - (progress / attackSamples) * (1 - this.dbToLinear(this.config.reductionDb))
          : this.dbToLinear(this.config.reductionDb);
        ducked[i] = musicLevels[i] * factor;
      }

      for (let i = endSample; i < endSample + releaseSamples && i < ducked.length; i++) {
        const progress = i - endSample;
        const factor = this.dbToLinear(this.config.reductionDb) + (progress / releaseSamples) * (1 - this.dbToLinear(this.config.reductionDb));
        ducked[i] = musicLevels[i] * factor;
      }
    }

    return ducked;
  }

  private dbToLinear(db: number): number {
    return Math.pow(10, db / 20);
  }
}
