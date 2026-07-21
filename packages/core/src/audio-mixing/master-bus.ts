import type { AMEQSettings, AMCompressorSettings, AMLimiterSettings, AMLoudnessTarget } from "./types.js";
import { AMEqualizer } from "./equalizer.js";
import { AMCompressor } from "./compressor.js";
import { AMLimiter } from "./limiter.js";
import { AMLoudnessNormalization } from "./loudness-normalization.js";

export class AMMasterBus {
  readonly eq: AMEqualizer;
  readonly compressor: AMCompressor;
  readonly limiter: AMLimiter;
  readonly loudness: AMLoudnessNormalization;

  constructor() {
    this.eq = new AMEqualizer();
    this.compressor = new AMCompressor();
    this.limiter = new AMLimiter();
    this.loudness = new AMLoudnessNormalization();
  }

  process(inputLevel: number): number {
    let signal = inputLevel;

    if (this.eq.getSettings().enabled) {
      signal = this.applyEQ(signal);
    }

    signal = this.compressor.process(signal);

    if (this.limiter.getSettings().enabled) {
      signal = this.limiter.process(signal);
    }

    return signal;
  }

  private applyEQ(_input: number): number {
    return _input;
  }

  normalizeToTarget(samples: Float64Array, target: AMLoudnessTarget): Float64Array {
    return this.loudness.normalize(samples, target.integratedLUFS);
  }

  getProcessingChain(): string[] {
    const chain = ["EQ"];
    chain.push("Compression");
    chain.push("Limiter");
    chain.push("Loudness");
    chain.push("Export");
    return chain;
  }

  reset(): void {
    this.eq.reset();
    this.compressor.reset();
    this.limiter.reset();
  }
}
