import { VPNarrationResult } from "./types";

export class VPVoiceConsistencyEngine {
  private toneHistory: number[] = [];
  private paceHistory: number[] = [];
  private loudnessHistory: number[] = [];
  private emotionHistory: string[] = [];
  private pronunciationHistory: Map<string, number> = new Map();

  trackTone(result: VPNarrationResult): void {
    const avgPitch = result.timingData.wordTimestamps.reduce(
      (sum, w, _i, arr) => sum + (w.end - w.start) / arr.length,
      0
    );
    this.toneHistory.push(avgPitch);
    if (this.toneHistory.length > 100) {
      this.toneHistory.shift();
    }
  }

  trackPace(result: VPNarrationResult): void {
    const wordCount = result.timingData.wordTimestamps.length;
    const pace = result.duration > 0 ? wordCount / result.duration : 0;
    this.paceHistory.push(pace);
    if (this.paceHistory.length > 100) {
      this.paceHistory.shift();
    }
  }

  trackLoudness(result: VPNarrationResult): void {
    const sentenceCount = result.timingData.sentenceTimestamps.length;
    const wordCount = result.timingData.wordTimestamps.length;
    const density = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    this.loudnessHistory.push(density);
    if (this.loudnessHistory.length > 100) {
      this.loudnessHistory.shift();
    }
  }

  trackEmotion(result: VPNarrationResult): void {
    this.emotionHistory.push(result.provider);
    if (this.emotionHistory.length > 100) {
      this.emotionHistory.shift();
    }
  }

  trackPronunciation(result: VPNarrationResult): void {
    for (const wt of result.timingData.wordTimestamps) {
      const word = wt.word.toLowerCase();
      const prev = this.pronunciationHistory.get(word) || 0;
      this.pronunciationHistory.set(word, prev + 1);
    }
    if (this.pronunciationHistory.size > 1000) {
      const entries = Array.from(this.pronunciationHistory.entries());
      const toDelete = entries.slice(0, entries.length - 1000);
      for (const [key] of toDelete) {
        this.pronunciationHistory.delete(key);
      }
    }
  }

  detectVoiceDrift(
    sceneResults: VPNarrationResult[]
  ): { drifting: boolean; metrics: Record<string, number[]> } {
    const metrics: Record<string, number[]> = {
      tone: [],
      pace: [],
      loudness: [],
      wordCount: [],
    };

    for (const result of sceneResults) {
      const wordCount = result.timingData.wordTimestamps.length;
      const avgWordDuration =
        wordCount > 0
          ? result.timingData.wordTimestamps.reduce(
              (sum, w) => sum + (w.end - w.start),
              0
            ) / wordCount
          : 0;
      const pace = result.duration > 0 ? wordCount / result.duration : 0;
      const sentenceCount = result.timingData.sentenceTimestamps.length;
      const density = sentenceCount > 0 ? wordCount / sentenceCount : 0;

      metrics.tone.push(Math.round(avgWordDuration * 1000) / 1000);
      metrics.pace.push(Math.round(pace * 100) / 100);
      metrics.loudness.push(Math.round(density * 100) / 100);
      metrics.wordCount.push(wordCount);
    }

    let drifting = false;
    if (metrics.pace.length >= 3) {
      const paceValues = metrics.pace;
      const mean = paceValues.reduce((a, b) => a + b, 0) / paceValues.length;
      const variance =
        paceValues.reduce((a, b) => a + (b - mean) ** 2, 0) / paceValues.length;
      const stdDev = Math.sqrt(variance);
      if (mean > 0 && stdDev / mean > 0.2) {
        drifting = true;
      }
    }

    if (metrics.tone.length >= 3) {
      const toneValues = metrics.tone;
      const mean = toneValues.reduce((a, b) => a + b, 0) / toneValues.length;
      const variance =
        toneValues.reduce((a, b) => a + (b - mean) ** 2, 0) / toneValues.length;
      const stdDev = Math.sqrt(variance);
      if (mean > 0 && stdDev / mean > 0.3) {
        drifting = true;
      }
    }

    return { drifting, metrics };
  }

  getToneHistory(): number[] {
    return [...this.toneHistory];
  }

  getPaceHistory(): number[] {
    return [...this.paceHistory];
  }

  getLoudnessHistory(): number[] {
    return [...this.loudnessHistory];
  }

  getEmotionHistory(): string[] {
    return [...this.emotionHistory];
  }

  reset(): void {
    this.toneHistory = [];
    this.paceHistory = [];
    this.loudnessHistory = [];
    this.emotionHistory = [];
    this.pronunciationHistory.clear();
  }
}
