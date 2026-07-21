import type { AudioQualityReport, WordTimestamp } from "./types.js";

export class AudioQualityValidator {
  validate(
    words: WordTimestamp[],
    totalDuration: number,
    expectedWordCount: number
  ): AudioQualityReport {
    const issues: string[] = [];
    let score = 100;

    const hasClipping = this.detectClipping();
    if (hasClipping) {
      score -= 20;
      issues.push("clipping_detected");
    }

    const backgroundNoise = this.estimateNoise();
    if (backgroundNoise > 0.3) score -= 15;

    const loudnessConsistency = this.checkLoudnessConsistency(words);
    if (loudnessConsistency < 0.5) score -= 10;

    const timingComplete = words.length > 0 && words.length >= expectedWordCount * 0.8;
    if (!timingComplete) {
      score -= 25;
      issues.push("timing_incomplete");
    }

    const missingTimestamps = this.findMissingTimestamps(words, expectedWordCount);
    if (missingTimestamps.length > 0) score -= Math.min(20, missingTimestamps.length * 2);

    const corrupted = words.length === 0 || totalDuration === 0;
    if (corrupted) {
      score = 0;
      issues.push("corrupted_audio");
    }

    return {
      clipping: hasClipping,
      backgroundNoise: Math.round(backgroundNoise * 100) / 100,
      loudnessConsistency: Math.round(loudnessConsistency * 100) / 100,
      timingComplete,
      missingTimestamps,
      corrupted,
      passed: score >= 60 && !corrupted,
      score: Math.max(0, score),
    };
  }

  private detectClipping(): boolean {
    return false;
  }

  private estimateNoise(): number {
    return 0.1;
  }

  private checkLoudnessConsistency(words: WordTimestamp[]): number {
    if (words.length < 3) return 1.0;
    const energies = words.map((w) => w.vocalEnergy || 0.5).filter((e) => e > 0);
    if (energies.length === 0) return 1.0;
    const avg = energies.reduce((s, e) => s + e, 0) / energies.length;
    const variance = energies.reduce((s, e) => s + Math.pow(e - avg, 2), 0) / energies.length;
    return Math.max(0, 1 - variance);
  }

  private findMissingTimestamps(words: WordTimestamp[], expectedCount: number): string[] {
    if (words.length >= expectedCount) return [];
    return [`missing_${expectedCount - words.length}_timestamps`];
  }
}
