import type { Pause, Silence } from "./types.js";

const PAUSE_THRESHOLDS = {
  natural: 0.3,
  long: 0.8,
  dramatic: 1.5,
  sentenceBreak: 0.5,
  paragraphBreak: 1.0,
};

const SILENCE_THRESHOLDS = {
  reflection: 1.0,
  dramatic: 2.0,
  ending: 3.0,
  breathing: 0.2,
};

export class PauseDetector {
  detect(words: Array<{ start: number; end: number }>): Pause[] {
    const pauses: Pause[] = [];

    for (let i = 0; i < words.length - 1; i++) {
      const gap = words[i + 1].start - words[i].end;
      if (gap < 0.15) continue;

      if (gap >= PAUSE_THRESHOLDS.dramatic) {
        pauses.push({ start: words[i].end, end: words[i + 1].start, duration: gap, type: "dramatic" });
      } else if (gap >= PAUSE_THRESHOLDS.long) {
        pauses.push({ start: words[i].end, end: words[i + 1].start, duration: gap, type: "long" });
      } else if (gap >= PAUSE_THRESHOLDS.paragraphBreak) {
        pauses.push({ start: words[i].end, end: words[i + 1].start, duration: gap, type: "paragraph_break" });
      } else if (gap >= PAUSE_THRESHOLDS.sentenceBreak) {
        pauses.push({ start: words[i].end, end: words[i + 1].start, duration: gap, type: "sentence_break" });
      } else if (gap >= PAUSE_THRESHOLDS.natural) {
        pauses.push({ start: words[i].end, end: words[i + 1].start, duration: gap, type: "natural" });
      }
    }

    return pauses;
  }

  getPreferredTransitionPoints(pauses: Pause[]): number[] {
    return pauses
      .filter((p) => p.type === "dramatic" || p.type === "paragraph_break")
      .map((p) => p.start + p.duration / 2);
  }
}

export class SilenceDetector {
  detect(pauses: Pause[]): Silence[] {
    const silences: Silence[] = [];

    for (const pause of pauses) {
      if (pause.duration >= SILENCE_THRESHOLDS.ending) {
        silences.push({ ...pause, type: "ending" });
      } else if (pause.duration >= SILENCE_THRESHOLDS.dramatic) {
        silences.push({ ...pause, type: "dramatic" });
      } else if (pause.duration >= SILENCE_THRESHOLDS.reflection) {
        silences.push({ ...pause, type: "reflection" });
      } else if (pause.duration >= SILENCE_THRESHOLDS.breathing) {
        silences.push({ ...pause, type: "breathing" });
      }
    }

    return silences;
  }
}
