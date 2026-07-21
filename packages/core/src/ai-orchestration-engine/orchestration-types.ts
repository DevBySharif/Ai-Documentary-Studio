export type AiCapabilityType =
  | "TextGeneration"
  | "ImageGeneration"
  | "VoiceGeneration"
  | "SpeechRecognition"
  | "Translation"
  | "Summarization"
  | "Embedding"
  | "OCR";

export type AiRoutingStrategy = "LowestCost" | "HighestQuality" | "LowestLatency" | "LocalOnly" | "Balanced";

export interface ModelDescriptor {
  readonly modelId: string;
  readonly modelName: string;
  readonly category: "Fast" | "Balanced" | "Premium" | "Local";
  readonly estimatedCostPerThousandTokensUSD: number;
}

export interface AiJobDescriptor {
  readonly jobId: string;
  readonly projectId: string;
  readonly capability: AiCapabilityType;
  readonly promptInput: string;
  readonly priority: number;
  readonly timeoutMs: number;
  readonly preferredStrategy: AiRoutingStrategy;
}

export interface NormalizedAiResponse<T = unknown> {
  readonly jobId: string;
  readonly result: T;
  readonly providerId: string;
  readonly modelId: string;
  readonly actualCostUSD: number;
  readonly latencyMs: number;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly warnings: ReadonlyArray<string>;
}

export interface ProviderHealthStatus {
  readonly providerId: string;
  readonly isAvailable: boolean;
  readonly averageLatencyMs: number;
  readonly errorRatePercent: number;
}
