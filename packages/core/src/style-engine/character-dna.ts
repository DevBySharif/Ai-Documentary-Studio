import type { CharacterDNAProfile } from "./types.js";

export const DEFAULT_CHARACTER: CharacterDNAProfile = {
  characterId: "default_stick",
  bodyShape: "simple_stick",
  headRatio: 1.0,
  limbLength: 1.0,
  poseRules: ["neutral_standing", "gesturing_right", "gesturing_left", "seated"],
  emotionRules: {
    curiosity: "head_tilt_slight",
    surprise: "raised_arms",
    calm: "relaxed_standing",
    reflection: "hand_on_chin",
    wonder: "looking_up",
  },
  silhouette: "stick_figure",
  accessories: [],
  identity: "documentary_host",
};

export class CharacterDNAProfileBuilder {
  build(overrides?: Partial<CharacterDNAProfile>): CharacterDNAProfile {
    return { ...DEFAULT_CHARACTER, ...overrides };
  }

  validate(profile: CharacterDNAProfile): { valid: boolean; issues: string[] } {
    if (!profile) throw new Error("CharacterDNAProfile is required for validation");

    const issues: string[] = [];

    if (!profile.characterId) issues.push("characterId is required");
    if (!profile.bodyShape) issues.push("bodyShape is required");
    if (typeof profile.headRatio !== "number" || profile.headRatio <= 0 || profile.headRatio > 3) {
      issues.push("headRatio must be a number between 0 and 3");
    }
    if (typeof profile.limbLength !== "number" || profile.limbLength <= 0 || profile.limbLength > 3) {
      issues.push("limbLength must be a number between 0 and 3");
    }
    if (!profile.silhouette) issues.push("silhouette is required");

    return { valid: issues.length === 0, issues };
  }

  compare(a: CharacterDNAProfile, b: CharacterDNAProfile): number {
    if (!a || !b) throw new Error("Both CharacterDNAProfile objects are required");

    let score = 0;
    const total = 6;

    if (a.bodyShape === b.bodyShape) score++;
    if (typeof a.headRatio === "number" && typeof b.headRatio === "number" && Math.abs(a.headRatio - b.headRatio) < 0.1) score++;
    if (typeof a.limbLength === "number" && typeof b.limbLength === "number" && Math.abs(a.limbLength - b.limbLength) < 0.1) score++;
    if (a.silhouette === b.silhouette) score++;
    if (a.identity === b.identity) score++;
    if (JSON.stringify(a.accessories ?? []) === JSON.stringify(b.accessories ?? [])) score++;

    return Math.round((score / total) * 100);
  }
}
