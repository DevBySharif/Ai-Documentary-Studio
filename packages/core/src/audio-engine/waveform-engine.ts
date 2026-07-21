export interface WaveformPeakData {
  readonly maxPeaks: Float32Array;
  readonly minPeaks: Float32Array;
  readonly rmsEnvelopes: Float32Array;
  readonly resolution: number; // samples per peak
}

/**
 * Waveform Engine (IB Part 17 - Section 14).
 * Generates zoom-independent multi-resolution peak and RMS envelope data.
 */
export class WaveformEngine {
  private cache = new Map<string, WaveformPeakData>();

  public generatePeaks(
    assetId: string,
    buffer: Float32Array,
    samplesPerPeak = 256
  ): WaveformPeakData {
    if (this.cache.has(assetId)) {
      return this.cache.get(assetId)!;
    }

    const peakCount = Math.ceil(buffer.length / samplesPerPeak);
    const maxPeaks = new Float32Array(peakCount);
    const minPeaks = new Float32Array(peakCount);
    const rmsEnvelopes = new Float32Array(peakCount);

    for (let p = 0; p < peakCount; p++) {
      const start = p * samplesPerPeak;
      const end = Math.min(start + samplesPerPeak, buffer.length);
      let max = -1;
      let min = 1;
      let sumSquares = 0;

      for (let i = start; i < end; i++) {
        const val = buffer[i];
        if (val > max) max = val;
        if (val < min) min = val;
        sumSquares += val * val;
      }

      maxPeaks[p] = max;
      minPeaks[p] = min;
      rmsEnvelopes[p] = Math.sqrt(sumSquares / (end - start || 1));
    }

    const data: WaveformPeakData = { maxPeaks, minPeaks, rmsEnvelopes, resolution: samplesPerPeak };
    this.cache.set(assetId, data);
    return data;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}
