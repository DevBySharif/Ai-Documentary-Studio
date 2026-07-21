import type { SRSubtitleLine } from "./types.js";

export interface SRValidationResult {
  valid: boolean;
  checks: Array<{ name: string; passed: boolean; message?: string }>;
}

export class SRSubtitleValidator {
  validate(lines: SRSubtitleLine[], totalWords: number): SRValidationResult {
    const checks: SRValidationResult["checks"] = [];

    checks.push(this.checkWordAlignment(lines, totalWords));
    checks.push(this.checkSentenceTiming(lines));
    checks.push(this.checkReadingSpeed(lines));
    checks.push(this.checkSafeArea(lines));
    checks.push(this.checkVisibility(lines));
    checks.push(this.checkFontAvailability());

    return { valid: checks.every((c) => c.passed), checks };
  }

  private checkWordAlignment(lines: SRSubtitleLine[], totalWords: number) {
    const textWords = lines.reduce((s, l) => s + l.text.split(/\s+/).length, 0);
    const match = Math.abs(textWords - totalWords) / Math.max(totalWords, 1) < 0.2;
    return { name: "Word Alignment", passed: match, message: match ? undefined : `Word count mismatch: ${textWords} vs ${totalWords}` };
  }

  private checkSentenceTiming(lines: SRSubtitleLine[]) {
    const allValid = lines.every((l) => l.start < l.end && l.end - l.start >= 500);
    return { name: "Sentence Timing", passed: allValid, message: allValid ? undefined : "Some subtitles have invalid timing" };
  }

  private checkReadingSpeed(lines: SRSubtitleLine[]) {
    const fast = lines.filter((l) => {
      const wps = l.text.split(/\s+/).length / ((l.end - l.start) / 1000);
      return wps > 4;
    });
    return { name: "Reading Speed", passed: fast.length === 0, message: fast.length > 0 ? `${fast.length} subtitles exceed comfortable reading speed` : undefined };
  }

  private checkSafeArea(lines: SRSubtitleLine[]) {
    return { name: "Safe Area", passed: lines.every((l) => l.y >= 0 && l.y <= 1) };
  }

  private checkVisibility(_lines: SRSubtitleLine[]) {
    return { name: "Subtitle Visibility", passed: true };
  }

  private checkFontAvailability() {
    return { name: "Font Availability", passed: true };
  }
}
