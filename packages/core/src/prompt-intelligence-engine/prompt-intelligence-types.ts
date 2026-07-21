export type TargetModelFamily = "LanguageModel" | "ImageModel" | "VoiceModel" | "VisionModel";

export interface PromptTemplateDescriptor {
  readonly templateId: string;
  readonly templateName: string;
  readonly parentTemplateId?: string;
  readonly category: string; // e.g. "Research", "Script", "Storyboard", "CinematicImage"
  readonly templateText: string;
  readonly requiredVariables: ReadonlyArray<string>;
  readonly version: number;
}

export interface PromptCompositionSections {
  readonly systemInstructions: string;
  readonly projectContext: string;
  readonly taskInstructions: string;
  readonly styleRules: string;
  readonly constraints: string;
  readonly outputFormat: string;
  readonly validationHints: string;
}

export interface PromptScoreCard {
  readonly completenessScore: number; // 0 - 100
  readonly clarityScore: number;
  readonly contextCoverageScore: number;
  readonly constraintConsistencyScore: number;
  readonly tokenEfficiencyScore: number;
  readonly overallScore: number;
}

export interface CompiledPromptResult {
  readonly promptId: string;
  readonly templateId: string;
  readonly targetModelFamily: TargetModelFamily;
  readonly compiledText: string;
  readonly tokenEstimate: number;
  readonly scoreCard: PromptScoreCard;
  readonly createdAt: Date;
}
