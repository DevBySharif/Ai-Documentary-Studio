export type AiCapabilityCategory =
  | "Research"
  | "Writing"
  | "Summarization"
  | "ImageGeneration"
  | "VoiceSynthesis"
  | "Translation"
  | "OCR"
  | "FactChecking"
  | "PromptOptimization"
  | "AssetClassification";

export type ModelCategoryType =
  | "GeneralLanguage"
  | "ResearchModel"
  | "CodingModel"
  | "VisionModel"
  | "ImageGenerationModel"
  | "SpeechRecognitionModel"
  | "VoiceSynthesisModel"
  | "EmbeddingModel";

export type AiExecutionMode =
  | "SingleModel"
  | "MultiModelCollaboration"
  | "Sequential"
  | "Parallel"
  | "HumanAssisted";

export type AiMemoryLevel = "TaskMemory" | "ProjectMemory" | "GlobalMemory";

export interface AiSessionDescriptor {
  readonly sessionId: string;
  readonly projectId: string;
  readonly capability: AiCapabilityCategory;
  readonly contextSources: ReadonlyArray<string>;
  readonly modelsUsed: ReadonlyArray<string>;
  readonly tokensConsumed: number;
  readonly totalCostUSD: number;
  readonly createdAt: Date;
}

export interface ContextWindowConfig {
  readonly maxTokenLimit: number;
  readonly relevanceThreshold: number; // e.g. 0.75
  readonly enableCompression: boolean;
  readonly enableHistoricalSummarization: boolean;
}
