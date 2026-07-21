import { VPNarrationResult } from "./types";

export interface VPChannelDNAProfile {
  voicePersonality: string;
  pacing: { targetWPM: number; tolerance: number };
  emotionalRange: string[];
  pronunciationRules: string[];
  intensityRange: { min: number; max: number };
}

export interface VPChannelDNAValidationResult {
  approved: boolean;
  score: number;
  issues: string[];
}

export class VPChannelDNAVoiceEnforcer {
  validateVoicePersonality(
    result: VPNarrationResult,
    channelDna: VPChannelDNAProfile
  ): { compliant: boolean; violations: string[] } {
    const violations: string[] = [];
    const wordCount = result.timingData.wordTimestamps.length;
    const sentenceCount = result.timingData.sentenceTimestamps.length;

    if (wordCount === 0) {
      violations.push("No words found in narration");
      return { compliant: false, violations };
    }

    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const personalityRules = channelDna.voicePersonality.toLowerCase();

    if (personalityRules.includes("concise") && avgWordsPerSentence > 20) {
      violations.push(
        `Average sentence length (${avgWordsPerSentence.toFixed(1)}) exceeds concise threshold`
      );
    }

    if (personalityRules.includes("detailed") && avgWordsPerSentence < 10) {
      violations.push(
        `Average sentence length (${avgWordsPerSentence.toFixed(1)}) below detailed threshold`
      );
    }

    return {
      compliant: violations.length === 0,
      violations,
    };
  }

  validatePacing(
    result: VPNarrationResult,
    channelDna: VPChannelDNAProfile
  ): boolean {
    const wordCount = result.timingData.wordTimestamps.length;
    if (result.duration <= 0 || wordCount === 0) return false;

    const actualWPM = (wordCount / result.duration) * 60;
    const targetWPM = channelDna.pacing.targetWPM;
    const tolerance = channelDna.pacing.tolerance;

    const lowerBound = targetWPM * (1 - tolerance);
    const upperBound = targetWPM * (1 + tolerance);

    return actualWPM >= lowerBound && actualWPM <= upperBound;
  }

  validateEmotionalIntensity(
    result: VPNarrationResult,
    channelDna: VPChannelDNAProfile
  ): boolean {
    const wordCount = result.timingData.wordTimestamps.length;
    const sentenceCount = result.timingData.sentenceTimestamps.length;

    if (sentenceCount === 0) return false;

    const avgPauseDuration = this.calculateAvgPause(result);
    const normalizedIntensity = Math.min(
      1,
      Math.max(0, avgPauseDuration / 2.0)
    );

    return (
      normalizedIntensity >= channelDna.intensityRange.min &&
      normalizedIntensity <= channelDna.intensityRange.max
    );
  }

  validatePronunciation(
    result: VPNarrationResult,
    _channelDna: VPChannelDNAProfile
  ): boolean {
    const wordCount = result.timingData.wordTimestamps.length;
    if (wordCount === 0) return false;

    for (const wt of result.timingData.wordTimestamps) {
      if (wt.end <= wt.start) return false;
      if (wt.word.length === 0) return false;
    }

    const gaps: number[] = [];
    for (let i = 1; i < result.timingData.wordTimestamps.length; i++) {
      gaps.push(
        result.timingData.wordTimestamps[i].start -
          result.timingData.wordTimestamps[i - 1].end
      );
    }
    const negativeGaps = gaps.filter((g) => g < 0);
    return negativeGaps.length === 0;
  }

  validate(
    result: VPNarrationResult,
    channelDna: VPChannelDNAProfile
  ): VPChannelDNAValidationResult {
    const issues: string[] = [];

    const personalityResult = this.validateVoicePersonality(result, channelDna);
    if (!personalityResult.compliant) {
      issues.push(...personalityResult.violations.map((v) => `Voice Personality: ${v}`));
    }

    if (!this.validatePacing(result, channelDna)) {
      issues.push("Pacing does not match Channel DNA requirements");
    }

    if (!this.validateEmotionalIntensity(result, channelDna)) {
      issues.push("Emotional intensity outside Channel DNA range");
    }

    if (!this.validatePronunciation(result, channelDna)) {
      issues.push("Pronunciation does not meet Channel DNA standards");
    }

    const score = Math.max(
      0,
      100 - issues.length * 20
    );

    return {
      approved: issues.length === 0,
      score,
      issues,
    };
  }

  private calculateAvgPause(result: VPNarrationResult): number {
    const words = result.timingData.wordTimestamps;
    if (words.length < 2) return 0;

    let totalPause = 0;
    let pauseCount = 0;
    for (let i = 1; i < words.length; i++) {
      const gap = words[i].start - words[i - 1].end;
      if (gap > 0.05) {
        totalPause += gap;
        pauseCount++;
      }
    }

    return pauseCount > 0 ? totalPause / pauseCount : 0;
  }
}
