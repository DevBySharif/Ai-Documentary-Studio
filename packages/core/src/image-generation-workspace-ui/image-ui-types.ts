export type ImageApprovalStage =
  | "Generated"
  | "AIReviewed"
  | "HumanReviewed"
  | "Approved"
  | "Locked";

export type GenerationJobStatus = "Queued" | "Running" | "Completed" | "Failed" | "Retrying";

export type RetryStrategyType =
  | "RetrySameProvider"
  | "SwitchProvider"
  | "ReduceComplexity"
  | "ModifyPromptAutomatically"
  | "ManualIntervention";

export interface CandidateImage {
  readonly candidateId: string;
  readonly imageUrl: string;
  readonly seed: number;
  readonly providerName: string;
  readonly isApproved: boolean;
  readonly generatedAt: Date;
}

export interface CharacterConsistencyProfile {
  readonly characterId: string;
  readonly characterName: string;
  readonly referenceImageUrls: ReadonlyArray<string>;
  readonly keyFeaturesDescription: string;
  readonly maxAllowedDeviationPercent: number;
}

export interface ImageQualityScore {
  readonly promptAdherenceScore: number; // 0-100
  readonly compositionScore: number;
  readonly historicalRealismScore: number;
  readonly technicalQualityScore: number;
  readonly characterConsistencyScore: number;
  readonly overallSuitabilityScore: number;
}

export interface ImageGenerationJob {
  readonly jobId: string;
  readonly shotId: string;
  readonly sceneId: string;
  readonly promptText: string;
  readonly providerName: string; // e.g. "FLUX.1-Dev", "SDXL"
  readonly triggerPhrase: string; // Word/Phrase trigger
  readonly status: GenerationJobStatus;
  readonly queuePosition: number;
  readonly retryCount: number;
  readonly candidates: ReadonlyArray<CandidateImage>;
  readonly qualityScore?: ImageQualityScore;
  readonly approvalStage: ImageApprovalStage;
  readonly createdAt: Date;
}
