import type { SRWord } from "./types.js";

export class SRAILineBreakEngine {
  break(words: SRWord[], maxWidth: number, fontSize: number, readingSpeed: number): string[] {
    const fullText = words.map((w) => w.text).join(" ");
    const avgCharWidth = fontSize * 0.6;
    const charsPerLine = Math.floor(maxWidth / avgCharWidth);

    if (fullText.length <= charsPerLine * 1.2) return [fullText];

    const sentences = fullText.match(/[^.!?]+[.!?]*/g) ?? [fullText];
    const lines: string[] = [];

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length === 0) continue;

      if (trimmed.length <= charsPerLine) {
        lines.push(trimmed);
        continue;
      }

      const parts = trimmed.split(/\s+/);
      let currentLine = "";
      for (const part of parts) {
        if ((currentLine + " " + part).trim().length <= charsPerLine) {
          currentLine += (currentLine ? " " : "") + part;
        } else {
          if (currentLine) lines.push(currentLine.trim());
          currentLine = part;
        }
      }
      if (currentLine) lines.push(currentLine.trim());
    }

    if (readingSpeed > 200 && lines.length > 2) {
      return this.combineLines(lines, charsPerLine);
    }

    return lines;
  }

  private combineLines(lines: string[], maxChars: number): string[] {
    const combined: string[] = [];
    for (let i = 0; i < lines.length; i += 2) {
      const pair = (lines[i] + " " + (lines[i + 1] ?? "")).trim();
      combined.push(pair.length <= maxChars ? pair : lines[i]);
      if (lines[i + 1] && pair.length > maxChars) combined.push(lines[i + 1]);
    }
    return combined;
  }
}
