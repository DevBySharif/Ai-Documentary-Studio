import type { QATimelineReport } from "./types.js";

export class QATimelineValidation {
  validate(missingScenes: number, emptyTimelines: number, subtitleGaps: number, audioGaps: number, brokenTransitions: number): QATimelineReport {
    const total = missingScenes + emptyTimelines + subtitleGaps + audioGaps + brokenTransitions;
    const hasIssues = total > 0;
    const overall = Math.round(Math.max(0, 100 - total * 10));

    return { missingScenes, emptyTimelines, subtitleGaps, audioGaps, brokenTransitions, overall, hasIssues };
  }

  isReady(report: QATimelineReport): boolean {
    return !report.hasIssues && report.overall >= 90;
  }
}
