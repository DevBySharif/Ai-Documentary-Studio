import type { SRWord, SRPhrase } from "./types.js";

export class SRPhraseGrouping {
  group(words: SRWord[], maxGap = 0.25): SRPhrase[] {
    if (words.length === 0) return [];
    const phrases: SRPhrase[] = [];
    let start = 0;

    for (let i = 1; i < words.length; i++) {
      if (words[i].start - words[i - 1].end > maxGap) {
        const slice = words.slice(start, i);
        phrases.push({ text: slice.map((w) => w.text).join(" "), words: slice, start: slice[0].start, end: slice[slice.length - 1].end });
        start = i;
      }
    }

    const last = words.slice(start);
    if (last.length > 0) phrases.push({ text: last.map((w) => w.text).join(" "), words: last, start: last[0].start, end: last[last.length - 1].end });
    return phrases;
  }
}
