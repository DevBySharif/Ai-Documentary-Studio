import { PronunciationRule, EmotionalToneStyle } from "./voice-ui-types";

export interface PauseMarker {
  readonly pauseId: string;
  readonly timestampSecs: number;
  readonly pauseType: "Natural" | "Dramatic" | "Breathing" | "ChapterTransition";
  readonly durationSecs: number;
}

/**
 * Pronunciation Dictionary Editor, Emotion Control & Pause Marker Manager (Vol 05 Part 10 - Section 10, Section 11, Section 12).
 * Manages reusable phonetic pronunciation rules, sentence/paragraph emotional tone guidance, and timeline-synchronized pause markers.
 */
export class PronunciationEmotionPauseEditor {
  private rules: PronunciationRule[] = [
    {
      ruleId: "rule_1",
      originalWord: "Brunel",
      phoneticSpelling: "Broo-NELL",
      category: "HistoricalFigure",
    },
  ];

  private pauseMarkers: PauseMarker[] = [];

  public addPronunciationRule(word: string, phonetic: string, category: PronunciationRule["category"]): PronunciationRule {
    const rule: PronunciationRule = {
      ruleId: `rule_${Math.random().toString(36).substring(2, 7)}`,
      originalWord: word,
      phoneticSpelling: phonetic,
      category,
    };
    this.rules.push(rule);
    return rule;
  }

  public insertPauseMarker(timestampSecs: number, type: PauseMarker["pauseType"], durationSecs: number): PauseMarker {
    const marker: PauseMarker = {
      pauseId: `pause_${Math.random().toString(36).substring(2, 7)}`,
      timestampSecs,
      pauseType: type,
      durationSecs,
    };
    this.pauseMarkers.push(marker);
    return marker;
  }

  public getRules(): ReadonlyArray<PronunciationRule> {
    return this.rules;
  }

  public getPauseMarkers(): ReadonlyArray<PauseMarker> {
    return this.pauseMarkers;
  }
}
