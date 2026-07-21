import type { QAManualFlag, QAIssueSeverity } from "./types.js";

export class QAManualReviewFlags {
  private flags: QAManualFlag[] = [];

  flag(issue: string, severity: QAIssueSeverity, reason: string): void {
    this.flags.push({ issue, severity, reason });
  }

  flagMissingNarration(): void {
    this.flag("Missing narration", "critical", "No narration audio detected for speaking segments");
  }

  flagIncorrectImage(): void {
    this.flag("Incorrect image", "critical", "Image does not match scene description");
  }

  flagSubtitleMismatch(): void {
    this.flag("Serious subtitle mismatch", "critical", "Subtitle text significantly differs from narration");
  }

  flagLargeSyncError(): void {
    this.flag("Large sync error", "critical", "Sync drift exceeds acceptable threshold");
  }

  flagCorruptedAsset(): void {
    this.flag("Corrupted asset", "critical", "Asset file is corrupted or unreadable");
  }

  flagFailedRender(): void {
    this.flag("Failed render segment", "critical", "Render segment did not complete successfully");
  }

  getFlags(): QAManualFlag[] {
    return [...this.flags];
  }

  hasCriticalFlags(): boolean {
    return this.flags.some((f) => f.severity === "critical");
  }

  clear(): void {
    this.flags = [];
  }
}
