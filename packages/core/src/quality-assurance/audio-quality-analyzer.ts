import type { QAAudioReport, QAIssue } from "./types.js";

export class QAAudioQualityAnalyzer {
  analyze(clarity: number, musicBalance: number, noise: number, clipping: number, lufs: number, stereoComp: number, dynRange: number): QAAudioReport {
    const issues: QAIssue[] = [];
    if (clarity < 0.7) issues.push({ type: "narration_clarity", severity: "critical", description: "Narration clarity below threshold", autoFixable: true, autoFixed: false, suggestedFix: "Increase narration gain and apply EQ" });
    if (noise > 0.3) issues.push({ type: "noise", severity: "warning", description: "Background noise detected", autoFixable: true, autoFixed: false, suggestedFix: "Enable noise reduction" });
    if (clipping > 0.1) issues.push({ type: "clipping", severity: "critical", description: "Audio clipping detected", autoFixable: true, autoFixed: false, suggestedFix: "Apply limiter at -1dB" });

    const overall = Math.round((clarity + musicBalance + (1 - noise) + (1 - clipping) + (lufs / 100) + stereoComp + (dynRange / 100)) / 7 * 100) / 100;
    return { narrationClarity: clarity, musicBalance, noise, clipping, lufs, stereoCompatibility: stereoComp, dynamicRange: dynRange, overall: Math.round(overall * 100), issues };
  }
}
