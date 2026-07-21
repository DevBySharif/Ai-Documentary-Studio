export type SegmentationLevel =
  | "Level1_Paragraph"
  | "Level2_Scene"
  | "Level3_Sentence"
  | "Level4_Phrase"
  | "Level5_Keyword";

export type VisualIntentType =
  | "PersonIntroduction"
  | "HistoricalEvent"
  | "GeographicLocation"
  | "ScientificExplanation"
  | "Comparison"
  | "TimelineProgression"
  | "EmotionalMoment"
  | "StatisticalInformation"
  | "AbstractConcept";

export type EmotionalTone =
  | "Tragedy"
  | "Hope"
  | "Discovery"
  | "Suspense"
  | "Celebration"
  | "Curiosity";

export interface ImportantWord {
  readonly word: string;
  readonly category: "Person" | "Country" | "City" | "Year" | "Battle" | "Discovery" | "Invention" | "Company" | "Disaster" | "ScientificTerm";
  readonly charOffset: number;
}

export interface AssetCandidate {
  readonly assetId: string;
  readonly title: string;
  readonly type: "HistoricalPhotograph" | "ArchivalFootage" | "Map" | "Diagram" | "Chart" | "AiIllustration" | "StockVideo" | "Document" | "MotionGraphics";
  readonly relevanceScore: number; // 0 to 100
  readonly historicalAccuracyScore: number;
  readonly visualQualityScore: number;
  readonly overallRankScore: number;
}

export interface VisualMatchRecommendation {
  readonly matchId: string;
  readonly textSegment: string;
  readonly level: SegmentationLevel;
  readonly visualIntent: VisualIntentType;
  readonly emotionalTone: EmotionalTone;
  readonly recommendedAsset: AssetCandidate;
  readonly alternativeAssets: ReadonlyArray<AssetCandidate>;
  readonly recommendedDurationSecs: number;
  readonly confidenceScore: number; // 0 to 1
  readonly matchReason: string;
  readonly isLockedByUser: boolean;
}
