import { SegmentationLevel, ImportantWord } from "./matcher-types";

export interface NarrationSegment {
  readonly segmentId: string;
  readonly text: string;
  readonly level: SegmentationLevel;
  readonly importantWords: ReadonlyArray<ImportantWord>;
}

/**
 * Narration Segmenter & Important Word Detector (Vol 04 Part 05 - Section 5, Section 7).
 * Divides narration into multi-level semantic segments and extracts key emphasis terms.
 */
export class NarrationSegmenter {
  public segmentNarration(text: string, defaultLevel: SegmentationLevel = "Level3_Sentence"): ReadonlyArray<NarrationSegment> {
    const rawSegments = text.split(/(?<=[.!?])\s+/);

    return rawSegments.map((seg, idx) => ({
      segmentId: `seg_${idx}_${Math.random().toString(36).substring(2, 7)}`,
      text: seg,
      level: defaultLevel,
      importantWords: this.detectImportantWords(seg),
    }));
  }

  private detectImportantWords(text: string): ReadonlyArray<ImportantWord> {
    const words: ImportantWord[] = [];
    const yearMatch = text.match(/\b(18|19|20)\d{2}\b/);
    if (yearMatch && yearMatch.index !== undefined) {
      words.push({ word: yearMatch[0], category: "Year", charOffset: yearMatch.index });
    }

    if (text.includes("Geneva") || text.includes("Paris") || text.includes("London")) {
      words.push({ word: "City", category: "City", charOffset: 0 });
    }

    return words;
  }
}
