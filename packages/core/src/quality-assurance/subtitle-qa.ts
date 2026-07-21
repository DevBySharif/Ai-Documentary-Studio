import type { QASubtitleReport, QAIssue } from "./types.js";

export class QASubtitleQA {
  analyze(wordTiming: number, sentenceTiming: number, readingSpeed: number, safeArea: number, fontConsistency: number, highlightAccuracy: number): QASubtitleReport {
    const issues: QAIssue[] = [];
    if (wordTiming < 0.8) issues.push({ type: "word_timing", severity: "warning", description: "Word timing drift detected", autoFixable: true, autoFixed: false, suggestedFix: "Realign word timestamps" });
    if (readingSpeed < 0.7) issues.push({ type: "reading_speed", severity: "warning", description: "Reading speed exceeds comfortable limit", autoFixable: true, autoFixed: false, suggestedFix: "Extend subtitle duration" });
    if (safeArea < 0.8) issues.push({ type: "safe_area", severity: "warning", description: "Subtitles outside safe area", autoFixable: true, autoFixed: false, suggestedFix: "Reposition subtitles" });

    const overall = Math.round((wordTiming + sentenceTiming + readingSpeed + safeArea + fontConsistency + highlightAccuracy) / 6 * 100) / 100;
    return { wordTiming, sentenceTiming, readingSpeed, safeArea, fontConsistency, highlightAccuracy, overall: Math.round(overall * 100), issues };
  }
}
