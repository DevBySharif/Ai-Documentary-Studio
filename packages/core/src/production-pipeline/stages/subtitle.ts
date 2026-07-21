import type { SubtitleEvent } from "../types.js";

export class SubtitleBuilder {
  build(timeline: unknown): SubtitleEvent[] {
    const events = (timeline as Array<{ text: string; startFrame: number; endFrame: number; isHighlighted?: boolean; isKeyword?: boolean }>) ?? [];

    return events.map((e, i) => ({
      startFrame: e.startFrame,
      endFrame: e.endFrame,
      text: e.text,
      isHighlighted: e.isHighlighted ?? (i % 5 === 0),
      isKeyword: e.isKeyword ?? e.text.length > 20
    }));
  }

  buildWordHighlights(words: Array<{ word: string; frame: number }>): SubtitleEvent[] {
    return words.map((w) => ({
      startFrame: w.frame,
      endFrame: w.frame + 3,
      text: w.word,
      isHighlighted: true,
      isKeyword: true
    }));
  }
}
