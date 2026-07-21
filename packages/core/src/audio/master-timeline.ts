import type { AudioMasterTimeline, MasterTimelineEntry, WordTimestamp, Pause, SyncPoint, Phrase } from "./types.js";

export class MasterTimelineGenerator {
  generate(
    words: WordTimestamp[],
    phrases: Phrase[],
    pauses: Pause[],
    syncPoints: SyncPoint[]
  ): AudioMasterTimeline {
    const entries: MasterTimelineEntry[] = [];
    const addedTimes = new Set<number>();

    for (const phrase of phrases) {
      const key = Math.round(phrase.start * 100);
      if (!addedTimes.has(key)) {
        addedTimes.add(key);
        entries.push({
          time: Math.round(phrase.start * 100) / 100,
          action: "phrase_start",
          duration: phrase.end - phrase.start,
          detail: phrase.text.slice(0, 60),
        });
      }
    }

    for (const word of words) {
      if (word.isEmphasized) {
        const key = Math.round(word.start * 100);
        if (!addedTimes.has(key)) {
          addedTimes.add(key);
          entries.push({
            time: Math.round(word.start * 100) / 100,
            action: "word_emphasis",
            duration: word.end - word.start,
            detail: word.word,
          });
        }
      }
    }

    for (const pause of pauses) {
      const key = Math.round(pause.start * 100);
      if (!addedTimes.has(key)) {
        addedTimes.add(key);
        entries.push({
          time: Math.round(pause.start * 100) / 100,
          action: `pause_${pause.type}`,
          duration: pause.duration,
          detail: `${pause.type} pause`,
        });
      }
    }

    for (const point of syncPoints) {
      const key = Math.round(point.timestamp * 100);
      if (!addedTimes.has(key)) {
        addedTimes.add(key);
        entries.push({
          time: Math.round(point.timestamp * 100) / 100,
          action: point.type,
          duration: 0,
          detail: JSON.stringify(point.data || {}),
        });
      }
    }

    entries.sort((a, b) => a.time - b.time);

    const lastWord = words[words.length - 1];
    const totalDuration = lastWord ? lastWord.end : 0;

    return { entries, totalDuration: Math.round(totalDuration * 100) / 100 };
  }
}
