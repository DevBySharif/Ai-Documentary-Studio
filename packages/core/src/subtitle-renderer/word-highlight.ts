import type { SRWord } from "./types.js";

export class SRWordHighlightEngine {
  generate(words: Array<{ text: string; start: number; end: number; confidence: number }>): SRWord[] {
    return words.map((w) => ({
      text: w.text,
      start: w.start,
      end: w.end,
      confidence: w.confidence,
      isHighlighted: true,
      isEmphasized: false
    }));
  }

  getHighlightedWordAtFrame(words: SRWord[], frame: number): SRWord | null {
    return words.find((w) => frame >= w.start && frame < w.end) ?? null;
  }

  getCurrentWordIndex(words: SRWord[], frame: number): number {
    return words.findIndex((w) => frame >= w.start && frame < w.end);
  }
}
