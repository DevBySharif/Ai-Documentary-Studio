export type SRSubtitleType = "sentence" | "phrase" | "word_by_word" | "keyword_highlight" | "speaker_label" | "translation" | "burn_in";

export type SRPosition = "bottom" | "top" | "center" | "adaptive";

export type SRAnimationStyle = "fade" | "pop" | "slide" | "typewriter" | "word_reveal" | "scale";

export type SREmphasisStyle = "bold" | "accent_color" | "glow" | "scale" | "underline" | "animation";

export type SRExportFormat = "burn_in" | "srt" | "ass" | "vtt" | "json_timeline";

export interface SRWord {
  text: string;
  start: number;
  end: number;
  confidence: number;
  isHighlighted: boolean;
  isEmphasized: boolean;
  emphasisStyle?: SREmphasisStyle;
}

export interface SRPhrase {
  text: string;
  words: SRWord[];
  start: number;
  end: number;
}

export interface SRSentence {
  text: string;
  start: number;
  end: number;
  words: SRWord[];
  readingSpeed: number;
}

export interface SRSubtitleLine {
  text: string;
  start: number;
  end: number;
  position: SRPosition;
  x: number;
  y: number;
  animation: SRAnimationStyle;
  highlightedWord?: string;
  emphasisColor?: string;
}

export interface SRReadingSpeedResult {
  charsPerSecond: number;
  wordsPerSecond: number;
  estimatedReadingTime: number;
  isComfortable: boolean;
}

export interface SRSafeZone {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface SRKeywordEmphasis {
  word: string;
  emotion: string;
  style: SREmphasisStyle;
  color: string;
  scale: number;
}

export interface SRCollisionEvent {
  element: string;
  type: "face" | "subject" | "watermark" | "logo" | "ui" | "crop";
  severity: "warning" | "critical";
  suggestedPosition: SRPosition;
}

export interface SRQualityScore {
  syncAccuracy: number;
  readingComfort: number;
  lineBreakQuality: number;
  highlightAccuracy: number;
  contrast: number;
  visibility: number;
  accessibility: number;
  overall: number;
  passed: boolean;
}

export interface SRAISubtitleDecision {
  position: SRPosition;
  highlightTiming: "normal" | "extended" | "reduced";
  lineBreakStyle: "natural" | "compact" | "expanded";
  animation: SRAnimationStyle;
  displayDuration: number;
}
