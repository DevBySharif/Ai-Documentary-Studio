import type { AIntSilence } from "./types.js";

export class AIntSilenceAnalyzer {
  analyze(audioLevels: number[], sampleRate: number, noiseFloor: number): AIntSilence[] {
    const silences: AIntSilence[] = [];
    let inSilence = false;
    let silenceStart = 0;

    for (let i = 0; i < audioLevels.length; i++) {
      if (audioLevels[i] < noiseFloor) {
        if (!inSilence) {
          silenceStart = i / sampleRate;
          inSilence = true;
        }
      } else if (inSilence) {
        const end = i / sampleRate;
        const duration = end - silenceStart;
        const type = this.classify(silenceStart, duration, audioLevels, sampleRate);
        silences.push({ start: silenceStart, end, duration, type });
        inSilence = false;
      }
    }

    return silences;
  }

  private classify(start: number, duration: number, _levels: number[], _sr: number): AIntSilence["type"] {
    if (duration > 1.5) return "intentional";
    if (duration > 0.8) return "transition";
    if (duration > 0.3) return "recording";
    return "noise_floor";
  }

  getIntentionalSilences(silences: AIntSilence[]): AIntSilence[] {
    return silences.filter((s) => s.type === "intentional" || s.type === "transition");
  }
}
