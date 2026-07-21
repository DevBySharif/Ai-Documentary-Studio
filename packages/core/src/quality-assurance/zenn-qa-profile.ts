import type { QAZennProfile } from "./types.js";

export class QAZennQAProfile {
  private profile: QAZennProfile = {
    pacing: "cinematic",
    grading: "consistent",
    motion: "smooth",
    readability: "high",
    narration: "clean",
    effects: "subtle",
    exportQuality: "professional"
  };

  getProfile(): QAZennProfile {
    return { ...this.profile };
  }

  getMinimumQualityThreshold(): number {
    return 85;
  }

  getStyleConsistencyThreshold(): number {
    return 80;
  }

  allowAutoFix(): boolean {
    return true;
  }

  requiresManualReview(): boolean {
    return false;
  }
}
