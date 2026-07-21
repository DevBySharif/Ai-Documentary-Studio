import type { AIntNormalizationConfig } from "./types.js";

export class AIntAudioNormalizer {
  private config: AIntNormalizationConfig = { targetLUFS: -14, peakLimit: -1, limiter: true, compressor: true, noiseReduction: true };

  configure(config: Partial<AIntNormalizationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): AIntNormalizationConfig {
    return { ...this.config };
  }

  normalize(data: number[]): number[] {
    let output = [...data];

    if (this.config.noiseReduction) output = this.reduceNoise(output);
    if (this.config.compressor) output = this.compress(output);
    if (this.config.limiter) output = this.limit(output, this.config.peakLimit);
    output = this.normalizePeak(output, this.config.targetLUFS);

    return output;
  }

  private reduceNoise(data: number[]): number[] {
    const noiseGate = 0.01;
    return data.map((s) => (Math.abs(s) < noiseGate ? 0 : s));
  }

  private compress(data: number[]): number[] {
    const threshold = 0.3;
    const ratio = 4;
    return data.map((s) => {
      const abs = Math.abs(s);
      if (abs > threshold) {
        const reduction = (abs - threshold) * (1 - 1 / ratio);
        return Math.sign(s) * (abs - reduction);
      }
      return s;
    });
  }

  private limit(data: number[], peakDb: number): number[] {
    const peak = Math.pow(10, peakDb / 20);
    const maxVal = Math.max(...data.map(Math.abs));
    const scale = maxVal > peak ? peak / maxVal : 1;
    return data.map((s) => s * scale);
  }

  private normalizePeak(data: number[], _targetLUFS: number): number[] {
    const maxVal = Math.max(...data.map(Math.abs));
    if (maxVal === 0) return data;
    const targetPeak = 0.95;
    const scale = targetPeak / maxVal;
    return data.map((s) => s * scale);
  }
}
