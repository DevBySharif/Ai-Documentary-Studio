import type { AdaptiveSyncProfile, SyncPriority } from "./types.js";

export interface ProfileRules {
  holdDurationMultiplier: number;
  transitionSpeed: string;
  wordInsertThreshold: number;
  motionIntensity: string;
  subtitleStyle: string;
  eventDensity: number;
  emphasisLevel: string;
}

const PROFILES: Record<AdaptiveSyncProfile, ProfileRules> = {
  documentary: {
    holdDurationMultiplier: 1.3,
    transitionSpeed: "slow",
    wordInsertThreshold: 8,
    motionIntensity: "low",
    subtitleStyle: "minimal",
    eventDensity: 0.3,
    emphasisLevel: "moderate",
  },
  educational: {
    holdDurationMultiplier: 1.0,
    transitionSpeed: "normal",
    wordInsertThreshold: 7,
    motionIntensity: "medium",
    subtitleStyle: "detailed",
    eventDensity: 0.5,
    emphasisLevel: "high",
  },
  storytelling: {
    holdDurationMultiplier: 1.2,
    transitionSpeed: "slow",
    wordInsertThreshold: 7,
    motionIntensity: "medium",
    subtitleStyle: "minimal",
    eventDensity: 0.4,
    emphasisLevel: "high",
  },
  motivational: {
    holdDurationMultiplier: 0.8,
    transitionSpeed: "fast",
    wordInsertThreshold: 6,
    motionIntensity: "high",
    subtitleStyle: "bold",
    eventDensity: 0.6,
    emphasisLevel: "very_high",
  },
  news: {
    holdDurationMultiplier: 0.7,
    transitionSpeed: "fast",
    wordInsertThreshold: 5,
    motionIntensity: "low",
    subtitleStyle: "standard",
    eventDensity: 0.7,
    emphasisLevel: "moderate",
  },
};

export class AdaptiveSyncProfileManager {
  getProfile(profile: AdaptiveSyncProfile): ProfileRules {
    return PROFILES[profile] ?? PROFILES.documentary;
  }

  getAvailableProfiles(): AdaptiveSyncProfile[] {
    return Object.keys(PROFILES) as AdaptiveSyncProfile[];
  }
}
