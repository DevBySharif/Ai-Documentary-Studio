import type { StyleLockState, CharacterLockState, PermanentStyleDNA, CharacterDNAProfile } from "./types.js";

export class StyleLockManager {
  buildFromDNA(dna: PermanentStyleDNA): StyleLockState {
    if (!dna) throw new Error("PermanentStyleDNA is required");

    return {
      artStyle: dna.artStyle,
      lineWeight: "consistent_medium",
      background: "minimal_gradient",
      lighting: dna.lighting,
      composition: "rule_of_thirds",
      camera: "medium_shot",
      visualMood: dna.mood,
    };
  }

  isLocked(_lock: StyleLockState, attribute: string): boolean {
    return attribute in (_lock ?? {});
  }

  assertNoOverride(lock: StyleLockState, attemptedOverrides: Partial<StyleLockState>): string[] {
    if (!lock) throw new Error("StyleLockState is required");
    if (!attemptedOverrides) return [];

    const violations: string[] = [];
    for (const [key, value] of Object.entries(attemptedOverrides)) {
      if (key in lock && lock[key as keyof StyleLockState] !== value) {
        violations.push(`${key} is locked to ${lock[key as keyof StyleLockState]}, cannot override to ${value}`);
      }
    }
    return violations;
  }
}

export class CharacterLockManager {
  buildFromDNA(dna: CharacterDNAProfile): CharacterLockState {
    if (!dna) throw new Error("CharacterDNAProfile is required");

    return {
      face: "minimal_abstract",
      eyes: "simple_dots",
      headShape: dna.headRatio && dna.headRatio > 1.2 ? "large_oval" : "circle",
      stickProportions: `limb_${Math.round((dna.limbLength ?? 1) * 100)}_body_${Math.round((dna.headRatio ?? 1) * 100)}`,
      movementStyle: "gentle_gestural",
      silhouette: dna.silhouette,
    };
  }

  isLocked(_lock: CharacterLockState, _attribute: string): boolean {
    return true;
  }

  assertNoOverride(lock: CharacterLockState, attemptedOverrides: Partial<CharacterLockState>): string[] {
    if (!lock) throw new Error("CharacterLockState is required");
    if (!attemptedOverrides) return [];

    const violations: string[] = [];
    for (const [key, value] of Object.entries(attemptedOverrides)) {
      if (key in lock && lock[key as keyof CharacterLockState] !== value) {
        violations.push(`Character ${key} is locked to ${String(lock[key as keyof CharacterLockState])}`);
      }
    }
    return violations;
  }
}
