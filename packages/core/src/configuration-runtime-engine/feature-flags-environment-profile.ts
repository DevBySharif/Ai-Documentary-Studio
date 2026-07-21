import { FeatureFlagState, EnvironmentProfile } from "./config-types";

/**
 * Feature Flags & Environment Profile Controller (Vol 06 Part 08 - Section 9, Section 10).
 * Controls feature availability (`Stable`, `Beta`, `Experimental`, `DeveloperOnly`) and environment profile defaults.
 */
export class FeatureFlagsEnvironmentProfile {
  private currentProfile: EnvironmentProfile = "Production";
  private flags = new Map<string, FeatureFlagState>();

  constructor() {
    this.flags.set("feature_experimental_ai_script", "Beta");
    this.flags.set("feature_gpu_acceleration", "Stable");
    this.flags.set("feature_cloud_sync", "Experimental");
  }

  public isFeatureEnabled(flagKey: string): boolean {
    const state = this.flags.get(flagKey);
    if (!state) return false;

    if (this.currentProfile === "Production") {
      return state === "Stable";
    }
    if (this.currentProfile === "Beta") {
      return state === "Stable" || state === "Beta";
    }
    return true; // Development or Testing profile allows all
  }

  public setEnvironmentProfile(profile: EnvironmentProfile): void {
    this.currentProfile = profile;
  }

  public getEnvironmentProfile(): EnvironmentProfile {
    return this.currentProfile;
  }
}
