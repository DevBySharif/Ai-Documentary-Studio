export type EvaluationTargetCategory =
  | "ResearchSummary"
  | "DocumentaryScript"
  | "Storyboard"
  | "ImagePrompt"
  | "GeneratedImage"
  | "VoiceNarration"
  | "Caption"
  | "Metadata"
  | "TimelineOutput";

export type QualityDecisionType =
  | "Accept"
  | "MinorRevision"
  | "Regenerate"
  | "AlternativeModel"
  | "HumanReview";

export type EvaluationDimension =
  | "Accuracy"
  | "Completeness"
  | "Clarity"
  | "Coherence"
  | "Consistency"
  | "Creativity"
  | "HistoricalCorrectness"
  | "Readability"
  | "StyleCompliance";

export interface StructuralValidationReport {
  readonly isValid: boolean;
  readonly missingFields: ReadonlyArray<string>;
  readonly isFormatValid: boolean;
  readonly isLanguageValid: boolean;
  readonly errors: ReadonlyArray<string>;
}

export interface QualityScoreCard {
  readonly overallQualityScore: number; // 0 - 100
  readonly confidenceScore: number;
  readonly factualConfidence: number;
  readonly styleComplianceScore: number;
  readonly structuralValidityScore: number;
  readonly dimensionBreakdown: Record<EvaluationDimension, number>;
}

export interface SelfReflectionResult {
  readonly isObjectiveSatisfied: boolean;
  readonly hasOmittedInfo: boolean;
  readonly hasContradictions: boolean;
  readonly isReasoningConsistent: boolean;
  readonly reflectionNotes: string;
}

export interface EvaluationHistoryRecord {
  readonly evaluationId: string;
  readonly targetCategory: EvaluationTargetCategory;
  readonly targetAssetId: string;
  readonly scores: QualityScoreCard;
  readonly decision: QualityDecisionType;
  readonly evaluator: string; // e.g. "CrossEvalModel_v2", "HumanReviewer"
  readonly selfReflection: SelfReflectionResult;
  readonly timestamp: Date;
}
