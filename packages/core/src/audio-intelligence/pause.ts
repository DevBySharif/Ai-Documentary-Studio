import type { AIntWord, AIntPause } from "./types.js";

export class AIntPauseDetector {
  detect(words: AIntWord[], threshold = 0.25): AIntPause[] {
    const pauses: AIntPause[] = [];

    for (let i = 1; i < words.length; i++) {
      const gap = words[i].start - words[i - 1].end;
      if (gap > threshold) {
        let type: AIntPause["type"] = "natural";
        if (gap > 0.8) type = "reflection";
        else if (gap > 0.5) type = "silent_gap";
        else if (gap > 0.3) type = "breath";

        pauses.push({ start: words[i - 1].end, end: words[i].start, duration: gap, type });
      }
    }

    return pauses;
  }

  getIdealTransitionPoints(pauses: AIntPause[], minDuration = 0.4): number[] {
    return pauses.filter((p) => p.duration >= minDuration).map((p) => p.start + p.duration / 2);
  }
}
