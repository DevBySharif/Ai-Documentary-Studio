import { AiCapabilityType, AiJobDescriptor, NormalizedAiResponse, ProviderHealthStatus } from "./orchestration-types";

/**
 * Standard Provider Adapter Interface (Vol 06 Part 06 - Section 5, Section 19).
 * Standardized contract implemented by all AI vendors (OpenAI, Gemini, FLUX, ElevenLabs, Ollama, etc.).
 */
export interface ProviderAdapterContract {
  readonly providerId: string;
  readonly supportedCapabilities: ReadonlyArray<AiCapabilityType>;
  readonly isLocal: boolean;

  initialize(): Promise<void>;
  healthCheck(): Promise<ProviderHealthStatus>;
  execute(job: AiJobDescriptor): Promise<NormalizedAiResponse>;
  cancel(jobId: string): Promise<boolean>;
  estimateCost(job: AiJobDescriptor): number;
  estimateLatency(job: AiJobDescriptor): number;
  shutdown(): Promise<void>;
}
