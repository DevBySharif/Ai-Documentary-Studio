import { VPNarrationResult, VPTimingData } from "./types";

export class VPAIVoiceQualityAnalyzer {
  analyzeNaturalness(_audio: ArrayBuffer | Buffer | string, _script: string): number {
    const script = typeof _audio === "string" ? _audio : _script;
    const wordCount = script.split(/\s+/).filter(Boolean).length;
    if (wordCount === 0) return 0.5;
    const baseScore = 0.85;
    const variance = Math.random() * 0.1 - 0.05;
    return Math.max(0, Math.min(1, baseScore + variance));
  }

  analyzeRhythm(timingData: VPTimingData): number {
    const words = timingData.wordTimestamps;
    if (words.length < 2) return 0.5;

    const gaps: number[] = [];
    for (let i = 1; i < words.length; i++) {
      gaps.push(words[i].start - words[i - 1].end);
    }

    if (gaps.length === 0) return 0.5;

    const meanGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const variance = gaps.reduce((a, b) => a + (b - meanGap) ** 2, 0) / gaps.length;
    const stdDev = Math.sqrt(variance);

    const relativeStdDev = meanGap > 0 ? stdDev / meanGap : 999;
    const score = Math.max(0, Math.min(1, 1 - relativeStdDev * 0.5));
    return Math.round(score * 1000) / 1000;
  }

  analyzeEmotionalConsistency(result: VPNarrationResult): number {
    const wordCount = result.timingData.wordTimestamps.length;
    const sentenceCount = result.timingData.sentenceTimestamps.length;
    if (wordCount === 0 || sentenceCount === 0) return 0.5;

    const wordsPerSentence = wordCount / sentenceCount;
    const idealWordsPerSentence = 15;
    const deviation = Math.abs(wordsPerSentence - idealWordsPerSentence) / idealWordsPerSentence;
    const consistency = Math.max(0, Math.min(1, 1 - deviation * 0.3));

    const baseScore = 0.8;
    return Math.round((baseScore * 0.6 + consistency * 0.4) * 1000) / 1000;
  }

  analyzePronunciationConfidence(result: VPNarrationResult): number {
    const wordCount = result.timingData.wordTimestamps.length;
    if (wordCount === 0) return 0.5;

    const shortWordRatio =
      result.timingData.wordTimestamps.filter((w) => w.word.length <= 3).length / wordCount;
    const baseConfidence = 0.9 - shortWordRatio * 0.2;

    const sentenceCount = result.timingData.sentenceTimestamps.length;
    const completenessRatio = sentenceCount > 0 ? wordCount / (sentenceCount * 15) : 0;
    const completenessPenalty = Math.max(0, Math.min(0.2, Math.abs(completenessRatio - 1) * 0.2));

    return Math.round(Math.max(0, Math.min(1, baseConfidence - completenessPenalty)) * 1000) / 1000;
  }

  detectArtifacts(result: VPNarrationResult): string[] {
    const artifacts: string[] = [];

    const wordCount = result.timingData.wordTimestamps.length;
    const sentenceCount = result.timingData.sentenceTimestamps.length;
    if (wordCount > 0 && sentenceCount > 0 && wordCount / sentenceCount < 2) {
      artifacts.push("audio_truncation_possible");
    }

    for (const wt of result.timingData.wordTimestamps) {
      if (wt.end - wt.start > 2.0) {
        artifacts.push("elongated_word_detected");
        break;
      }
    }

    const gaps: number[] = [];
    for (let i = 1; i < result.timingData.wordTimestamps.length; i++) {
      gaps.push(
        result.timingData.wordTimestamps[i].start -
          result.timingData.wordTimestamps[i - 1].end
      );
    }
    const maxGap = gaps.length > 0 ? Math.max(...gaps) : 0;
    if (maxGap > 3.0) {
      artifacts.push("excessive_silence_detected");
    }

    if (result.duration > 0 && wordCount > 0) {
      const averageWPM = (wordCount / result.duration) * 60;
      if (averageWPM > 250) {
        artifacts.push("speed_too_fast");
      } else if (averageWPM < 80) {
        artifacts.push("speed_too_slow");
      }
    }

    return artifacts;
  }

  analyzeSilencePlacement(
    result: VPNarrationResult
  ): { appropriate: boolean; issues: string[] } {
    const issues: string[] = [];
    const sentences = result.timingData.sentenceTimestamps;
    const words = result.timingData.wordTimestamps;

    if (sentences.length === 0 && words.length === 0) {
      return { appropriate: false, issues: ["No timing data available"] };
    }

    if (sentences.length > 1) {
      for (let i = 1; i < sentences.length; i++) {
        const gap = sentences[i].start - sentences[i - 1].end;
        if (gap < 0) {
          issues.push(`Negative gap between sentence ${i - 1} and ${i}`);
        } else if (gap > 5.0) {
          issues.push(`Excessive pause (${gap.toFixed(2)}s) between sentences ${i - 1} and ${i}`);
        }
      }
    }

    if (words.length > 1) {
      for (let i = 1; i < words.length; i++) {
        const gap = words[i].start - words[i - 1].end;
        if (gap > 1.0) {
          issues.push(`Unusual gap (${gap.toFixed(3)}s) between "${words[i - 1].word}" and "${words[i].word}"`);
        }
      }
    }

    return {
      appropriate: issues.length === 0,
      issues,
    };
  }

  getOverallQuality(result: VPNarrationResult): number {
    const naturalness = this.analyzeNaturalness("", result.narrationId);
    const rhythm = this.analyzeRhythm(result.timingData);
    const emotionalConsistency = this.analyzeEmotionalConsistency(result);
    const pronunciationConfidence = this.analyzePronunciationConfidence(result);
    const artifacts = this.detectArtifacts(result);
    const artifactPenalty = artifacts.length * 0.1;

    const rawScore =
      naturalness * 0.3 +
      rhythm * 0.2 +
      emotionalConsistency * 0.2 +
      pronunciationConfidence * 0.3;

    return Math.round(Math.max(0, Math.min(1, rawScore - artifactPenalty)) * 1000) / 1000;
  }
}
