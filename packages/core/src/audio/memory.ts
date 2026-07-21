import type { AudioMemoryEntry, SpeechRateMetrics } from "./types.js";

export class AudioMemory {
  private store = new Map<string, AudioMemoryEntry>();

  save(entry: AudioMemoryEntry): void {
    const existing = this.store.get(entry.voiceProfileId);
    if (existing) {
      existing.previousNarration.push(...entry.previousNarration);
      existing.speechRhythm = entry.speechRhythm;
      existing.preferredPacing = entry.preferredPacing;
    } else {
      this.store.set(entry.voiceProfileId, {
        ...entry,
        pronunciationOverrides: new Map(entry.pronunciationOverrides),
      });
    }
  }

  get(voiceProfileId: string): AudioMemoryEntry | undefined {
    return this.store.get(voiceProfileId);
  }

  addPronunciationOverride(voiceProfileId: string, word: string, pronunciation: string): void {
    const entry = this.store.get(voiceProfileId);
    if (entry) {
      entry.pronunciationOverrides.set(word, pronunciation);
    }
  }

  getPreferredPacing(voiceProfileId: string): number | null {
    const entry = this.store.get(voiceProfileId);
    return entry?.preferredPacing ?? null;
  }

  hasVoiceHistory(voiceProfileId: string): boolean {
    const entry = this.store.get(voiceProfileId);
    return entry !== undefined && entry.previousNarration.length > 0;
  }
}
