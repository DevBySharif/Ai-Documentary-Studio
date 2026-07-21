export type PromptCategory =
  | "Research"
  | "Script"
  | "Storyboard"
  | "ImageGeneration"
  | "Voice"
  | "Timeline"
  | "Review"
  | "Export";

export interface PromptVariable {
  readonly name: string; // e.g. "Character"
  readonly defaultValue: string; // e.g. "Isambard Kingdom Brunel"
  readonly description: string;
}

export interface PromptBlockItem {
  readonly blockId: string;
  readonly name: string; // e.g. "Camera Language Preset"
  readonly category: "Camera" | "ColorGrading" | "HistoricalRealism" | "NegativePrompt" | "Lighting";
  readonly contentText: string;
}

export interface PromptTemplateDescriptor {
  readonly promptId: string;
  readonly title: string;
  readonly category: PromptCategory;
  readonly parentPromptId?: string; // Prompt Inheritance
  readonly templateText: string;
  readonly variables: ReadonlyArray<PromptVariable>;
  readonly versionNumber: number;
}

export interface PromptScoreMetrics {
  readonly clarityScore: number; // 0-100
  readonly completenessScore: number;
  readonly variableUsageScore: number;
  readonly reusabilityScore: number;
  readonly overallQualityScore: number;
}

export interface PromptDebugIssue {
  readonly issueId: string;
  readonly severity: "Error" | "Warning" | "Info";
  readonly title: string;
  readonly description: string;
  readonly suggestedFix: string;
}

export interface ModelComparisonResult {
  readonly providerName: string; // "FLUX" | "SDXL" | "GPTImage" | "Imagen"
  readonly previewUrl: string;
  readonly executionTimeMs: number;
  readonly estimatedCostDollars: number;
  readonly qualityRatingScore: number;
}
