import { VPNarrationResult } from "./types";

export interface VPValidationResult {
  valid: boolean;
  issues: string[];
}

export class VPQualityValidation {
  validateClipping(result: VPNarrationResult): boolean {
    if (result.duration <= 0) return false;
    for (const st of result.timingData.sentenceTimestamps) {
      if (st.start < 0 || st.end < st.start) return false;
    }
    for (const wt of result.timingData.wordTimestamps) {
      if (wt.start < 0 || wt.end < wt.start) return false;
    }
    const lastEnd = Math.max(
      ...result.timingData.sentenceTimestamps.map((s) => s.end),
      ...result.timingData.wordTimestamps.map((w) => w.end),
      0
    );
    if (lastEnd > result.duration * 1.5) return false;
    return true;
  }

  validateSilence(result: VPNarrationResult): boolean {
    const sentenceCount = result.timingData.sentenceTimestamps.length;
    const wordCount = result.timingData.wordTimestamps.length;
    if (sentenceCount === 0 || wordCount === 0) return false;
    if (sentenceCount > wordCount) return false;
    let totalGap = 0;
    const gaps: number[] = [];
    for (let i = 1; i < result.timingData.wordTimestamps.length; i++) {
      const gap =
        result.timingData.wordTimestamps[i].start -
        result.timingData.wordTimestamps[i - 1].end;
      gaps.push(gap);
      totalGap += gap;
    }
    const avgGap = gaps.length > 0 ? totalGap / gaps.length : 0;
    const excessiveSilences = gaps.filter((g) => g > avgGap * 3).length;
    return excessiveSilences <= Math.ceil(gaps.length * 0.1);
  }

  validatePronunciation(result: VPNarrationResult): { errors: string[] } {
    const errors: string[] = [];
    if (!result.narrationId) {
      errors.push("Missing narration ID");
    }
    if (result.duration <= 0) {
      errors.push("Invalid duration");
    }
    if (
      result.timingData.wordTimestamps.length === 0 &&
      result.timingData.sentenceTimestamps.length > 0
    ) {
      errors.push("Missing word-level timestamps despite having sentences");
    }
    return { errors };
  }

  validatePauses(result: VPNarrationResult): boolean {
    const sentenceTimestamps = result.timingData.sentenceTimestamps;
    if (sentenceTimestamps.length <= 1) return true;
    for (let i = 1; i < sentenceTimestamps.length; i++) {
      const gap =
        sentenceTimestamps[i].start - sentenceTimestamps[i - 1].end;
      if (gap < 0) return false;
    }
    return true;
  }

  validateTimingIntegrity(result: VPNarrationResult): boolean {
    for (const st of result.timingData.sentenceTimestamps) {
      for (const wt of result.timingData.wordTimestamps) {
        if (wt.start < st.start || wt.end > st.end) {
          const sentenceWithWord = st.text.includes(wt.word);
          if (sentenceWithWord) return false;
        }
      }
    }
    const allStarts = [
      ...result.timingData.sentenceTimestamps.map((s) => s.start),
      ...result.timingData.wordTimestamps.map((w) => w.start),
    ].sort((a, b) => a - b);
    for (let i = 1; i < allStarts.length; i++) {
      if (allStarts[i] < allStarts[i - 1]) return false;
    }
    return true;
  }

  validateFormat(result: VPNarrationResult): boolean {
    if (!result.narrationId || result.narrationId.trim() === "") return false;
    if (!result.provider) return false;
    if (!result.language) return false;
    if (result.status !== "completed" && result.status !== "failed" && result.status !== "pending" && result.status !== "partial") return false;
    if (result.duration < 0) return false;
    if (result.cost < 0) return false;
    return true;
  }

  validate(result: VPNarrationResult): VPValidationResult {
    const issues: string[] = [];
    if (!this.validateClipping(result)) issues.push("Clipping validation failed");
    if (!this.validateSilence(result)) issues.push("Silence validation failed");
    const pronResult = this.validatePronunciation(result);
    issues.push(...pronResult.errors.map((e) => `Pronunciation: ${e}`));
    if (!this.validatePauses(result)) issues.push("Pause validation failed");
    if (!this.validateTimingIntegrity(result)) issues.push("Timing integrity validation failed");
    if (!this.validateFormat(result)) issues.push("Format validation failed");
    return { valid: issues.length === 0, issues };
  }
}
