import { SyncLevel, WordTriggerType } from "./composer-types";

export interface WordTriggerPoint {
  readonly word: string;
  readonly triggerType: WordTriggerType;
  readonly timestampSecs: number;
}

/**
 * Multi-Level Narration Synchronization Engine (Vol 04 Part 09 - Section 5, Section 6, Section 7).
 * Synchronizes narration down to phrase and semantically significant word-level triggers.
 */
export class NarrationSyncEngine {
  public selectBestSyncLevel(narrationComplexity: number): SyncLevel {
    if (narrationComplexity > 80) return "WordLevel";
    if (narrationComplexity > 50) return "SentenceLevel";
    return "SceneLevel";
  }

  public detectWordTriggers(narrationText: string, totalDurationSecs: number): ReadonlyArray<WordTriggerPoint> {
    const triggers: WordTriggerPoint[] = [];
    const words = narrationText.split(/\s+/);
    const secsPerWord = totalDurationSecs / Math.max(1, words.length);

    words.forEach((w, idx) => {
      const cleanWord = w.replace(/[^a-zA-Z0-9]/g, "");
      if (/\b(18|19|20)\d{2}\b/.test(cleanWord)) {
        triggers.push({ word: cleanWord, triggerType: "TimelineMarker", timestampSecs: Math.round(idx * secsPerWord * 10) / 10 });
      } else if (cleanWord === "war" || cleanWord === "treaty" || cleanWord === "battle") {
        triggers.push({ word: cleanWord, triggerType: "ArchivePhotograph", timestampSecs: Math.round(idx * secsPerWord * 10) / 10 });
      }
    });

    return triggers;
  }
}
