export interface TextGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  apiKey?: string;
}

export interface TextGenerationResult {
  text: string;
  provider: string;
  model: string;
  latencyMs: number;
  costEstimateUsd: number;
  responseId?: string;
  rawHeaders?: Record<string, string>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ImageGenerationOptions {
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3';
  resolution?: '1080p' | '4K' | '720p';
  style?: string;
  apiKey?: string;
}

export interface ImageGenerationResult {
  url: string;
  prompt: string;
  provider: string;
  width: number;
  height: number;
  latencyMs: number;
  costEstimateUsd: number;
}

export interface SpeechGenerationOptions {
  voiceId?: string;
  stability?: number;
  clarity?: number;
  speed?: number;
  apiKey?: string;
}

export interface SpeechGenerationResult {
  audioBuffer: ArrayBuffer;
  audioUrl?: string;
  durationMs: number;
  provider: string;
  voiceId: string;
  latencyMs: number;
  costEstimateUsd: number;
}

export interface ProviderHealthStatus {
  providerName: string;
  isAvailable: boolean;
  hasApiKey: boolean;
  latencyMs: number;
  lastChecked: Date;
}

export interface AIProvider {
  readonly name: string;
  readonly supportedModels: string[];

  isHealthy(): Promise<ProviderHealthStatus>;

  generateText(prompt: string, options?: TextGenerationOptions): Promise<TextGenerationResult>;
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult>;
  generateSpeech(text: string, options?: SpeechGenerationOptions): Promise<SpeechGenerationResult>;
}
