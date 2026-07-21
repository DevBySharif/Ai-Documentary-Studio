export interface LoudnessMeasurement {
  readonly peakDb: number;
  readonly rmsDb: number;
  readonly lufs: number;
  readonly isClipping: boolean;
}

/**
 * Loudness Management & Monitoring System (IB Part 17 - Section 13, Section 17).
 * Peak, RMS, LUFS measurement & clipping detection.
 */
export class LoudnessManager {
  public measureBuffer(buffer: Float32Array): LoudnessMeasurement {
    if (buffer.length === 0) {
      return { peakDb: -100, rmsDb: -100, lufs: -100, isClipping: false };
    }

    let maxSample = 0;
    let sumSquares = 0;

    for (let i = 0; i < buffer.length; i++) {
      const absSample = Math.abs(buffer[i]);
      if (absSample > maxSample) {
        maxSample = absSample;
      }
      sumSquares += buffer[i] * buffer[i];
    }

    const rms = Math.sqrt(sumSquares / buffer.length);
    const peakDb = maxSample > 0 ? 20 * Math.log10(maxSample) : -100;
    const rmsDb = rms > 0 ? 20 * Math.log10(rms) : -100;

    // Simplified LUFS estimation (EBU R128 weighting approximation)
    const lufs = rmsDb - 0.6;
    const isClipping = maxSample >= 1.0;

    return {
      peakDb: Math.round(peakDb * 10) / 10,
      rmsDb: Math.round(rmsDb * 10) / 10,
      lufs: Math.round(lufs * 10) / 10,
      isClipping,
    };
  }
}
