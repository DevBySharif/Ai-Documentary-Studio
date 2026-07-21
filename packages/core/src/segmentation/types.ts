import type { EmotionTag } from "../story/types.js";

export type SegmentType = "introduction" | "explanation" | "example" | "metaphor" | "question" | "reveal" | "emotion" | "transition" | "ending";

export type VisualComplexity = "simple" | "medium" | "complex" | "highly_abstract";

export type VisualIntent = "explain" | "illustrate" | "emphasize" | "symbolize" | "reveal" | "question" | "compare" | "recall" | "transition";

export interface ConceptCluster {
  primary: string;
  secondary: string[];
  supporting: string[];
}

export interface SemanticSegment {
  id: string;
  index: number;
  start: number;
  end: number;
  type: SegmentType;
  concept: ConceptCluster;
  emotion: EmotionTag;
  importance: number;
  complexity: VisualComplexity;
  visualIntent: VisualIntent;
  isQuestion: boolean;
  isReveal: boolean;
  isMetaphor: boolean;
  metaphorSymbol?: string;
  continuityScore: number;
  recommendedStrategy: "reuse" | "new_image" | "word_insert" | "symbol_insert" | "motion_only";
  scene: number;
  text: string;
}

export interface SegmentationResult {
  segments: SemanticSegment[];
  totalSegments: number;
  averageImportance: number;
  metadata: {
    generatedAt: string;
    conceptShifts: number;
    emotionShifts: number;
    metaphors: number;
    questions: number;
    reveals: number;
    merges: number;
  };
}
