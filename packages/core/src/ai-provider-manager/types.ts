export type APProviderName = "gemini" | "openai" | "claude" | "openrouter" | "ollama" | "lm_studio" | "google_ai_studio";

export type APTaskType = "script" | "prompt" | "image_analysis" | "qa" | "topic_research" | "transcription" | "tts";

export type APCapability = "text_generation" | "vision" | "structured_json" | "function_calling" | "long_context" | "reasoning" | "streaming";

export type APHealthStatus = "healthy" | "degraded" | "unavailable";

export interface APModel {
  provider: APProviderName;
  modelName: string;
  contextWindow: number;
  capabilities: APCapability[];
  cost: number;
  speed: number;
  available: boolean;
}

export interface APRouteRule {
  task: APTaskType;
  provider: APProviderName;
  model: string;
  fallback: APProviderName[];
}

export interface APUsageRecord {
  promptTokens: number;
  completionTokens: number;
  estimatedCost: number;
  provider: APProviderName;
  timestamp: number;
  cached: boolean;
}

export interface APBenchmark {
  provider: APProviderName;
  model: string;
  avgLatency: number;
  jsonAccuracy: number;
  promptQuality: number;
  hallucinationRate: number;
  costEfficiency: number;
  stability: number;
}

export interface APAPIKey {
  provider: APProviderName;
  key: string;
  label: string;
}

export interface APOutputContract {
  provider: string;
  model: string;
  status: string;
  latency: string;
  cached: boolean;
}
