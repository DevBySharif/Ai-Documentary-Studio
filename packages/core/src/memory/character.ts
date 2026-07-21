import type { CharacterMemoryEntry } from "./types.js";

export class CharacterMemoryStore {
  private store = new Map<string, CharacterMemoryEntry>();

  add(entry: CharacterMemoryEntry): void {
    const existing = this.store.get(entry.characterId);
    if (existing) {
      existing.previousAppearances.push(
        `${entry.lastPose}_${entry.lastEmotion}_${entry.lastLocation}`
      );
      existing.lastPose = entry.lastPose;
      existing.lastExpression = entry.lastExpression;
      existing.lastEmotion = entry.lastEmotion;
      existing.lastLocation = entry.lastLocation;
      existing.scale = entry.scale;
      existing.cameraAngle = entry.cameraAngle;
    } else {
      this.store.set(entry.characterId, {
        ...entry,
        previousAppearances: [],
      });
    }
  }

  get(characterId: string): CharacterMemoryEntry | undefined {
    return this.store.get(characterId);
  }

  wouldDrift(characterId: string, newPose: string, newExpression: string): boolean {
    const entry = this.get(characterId);
    if (!entry) return false;
    return entry.lastPose !== newPose || entry.lastExpression !== newExpression;
  }

  getLastAppearance(characterId: string): string | undefined {
    const entry = this.get(characterId);
    return entry?.previousAppearances[entry.previousAppearances.length - 1];
  }

  size(): number {
    return this.store.size;
  }
}
