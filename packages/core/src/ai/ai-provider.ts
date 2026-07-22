export interface TextGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface TextGenerationResult {
  text: string;
  provider: string;
  model: string;
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
}

export interface ImageGenerationResult {
  url: string;
  prompt: string;
  provider: string;
  width: number;
  height: number;
}

export interface SpeechGenerationOptions {
  voiceId?: string;
  stability?: number;
  clarity?: number;
  speed?: number;
}

export interface SpeechGenerationResult {
  audioBuffer: ArrayBuffer;
  audioUrl?: string;
  durationMs: number;
  provider: string;
  voiceId: string;
}

export interface ProviderHealthStatus {
  providerName: string;
  isAvailable: boolean;
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
