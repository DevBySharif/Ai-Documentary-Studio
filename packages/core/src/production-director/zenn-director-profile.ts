import type { PDZennProfile } from "./types.js";

export class PDZennDirectorProfile {
  private profile: PDZennProfile = {
    philosophy: "Story first",
    pacing: "Calm cinematic",
    consistency: "High visual consistency",
    effects: "Minimal unnecessary",
    quality: "Professional documentary"
  };

  getProfile(): PDZennProfile {
    return { ...this.profile };
  }

  getDefaultPacing(): string {
    return "calm";
  }

  prefersSimplicity(): boolean {
    return true;
  }

  isDeterministic(): boolean {
    return true;
  }
}
