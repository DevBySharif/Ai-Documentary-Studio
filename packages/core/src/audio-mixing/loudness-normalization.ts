import type { AMLoudnessTarget, AMExportProfile } from "./types.js";

export class AMLoudnessNormalization {
  private readonly profiles: Record<AMExportProfile, AMLoudnessTarget> = {
    youtube_long: { integratedLUFS: -14, shortTermLUFS: -16, truePeak: -1 },
    youtube_shorts: { integratedLUFS: -13, shortTermLUFS: -15, truePeak: -1 },
    podcast: { integratedLUFS: -16, shortTermLUFS: -18, truePeak: -1.5 },
    instagram_reels: { integratedLUFS: -12, shortTermLUFS: -14, truePeak: -0.5 },
    tiktok: { integratedLUFS: -11, shortTermLUFS: -13, truePeak: -0.5 },
    local_archive_lossless: { integratedLUFS: -18, shortTermLUFS: -20, truePeak: -3 }
  };

  getTarget(profile: AMExportProfile): AMLoudnessTarget {
    return { ...this.profiles[profile] };
  }

  measureIntegratedLoudness(samples: Float64Array): number {
    let sum = 0;
    for (let i = 0; i < samples.length; i++) {
      sum += samples[i] * samples[i];
    }
    const rms = Math.sqrt(sum / samples.length);
    return 20 * Math.log10(rms);
  }

  measureTruePeak(samples: Float64Array): number {
    let peak = 0;
    for (let i = 0; i < samples.length; i++) {
      const abs = Math.abs(samples[i]);
      if (abs > peak) peak = abs;
    }
    return 20 * Math.log10(peak);
  }

  normalize(samples: Float64Array, targetLUFS: number): Float64Array {
    const currentLUFS = this.measureIntegratedLoudness(samples);
    const gain = targetLUFS - currentLUFS;
    const gainLinear = Math.pow(10, gain / 20);

    const result = new Float64Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      result[i] = samples[i] * gainLinear;
    }

    return result;
  }

  adjustToTarget(samples: Float64Array, profile: AMExportProfile): Float64Array {
    const target = this.getTarget(profile);
    return this.normalize(samples, target.integratedLUFS);
  }

  validateLoudness(samples: Float64Array, target: AMLoudnessTarget): { integratedOK: boolean; truePeakOK: boolean } {
    const integrated = this.measureIntegratedLoudness(samples);
    const truePeak = this.measureTruePeak(samples);
    return {
      integratedOK: Math.abs(integrated - target.integratedLUFS) <= 1,
      truePeakOK: truePeak <= target.truePeak
    };
  }
}
