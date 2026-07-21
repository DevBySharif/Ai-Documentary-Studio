import { AiProviderName } from "./provider-contract";

export interface AiCapabilities {
  readonly toolUse: boolean;
  readonly streaming: boolean;
  readonly vision: boolean;
  readonly audio: boolean;
  readonly longContext: boolean;
  readonly structuredOutputs: boolean;
}

export interface ModelDescriptor {
  readonly modelId: string;
  readonly providerName: AiProviderName;
  readonly capabilities: AiCapabilities;
  readonly contextWindowTokens: number;
  readonly costPer1kInputTokensUsd: number;
  readonly costPer1kOutputTokensUsd: number;
  readonly isAvailable: boolean;
}

/**
 * Centralized Model & Capability Registry (IB Part 18 - Section 5, Section 24).
 * Tracks model capabilities, pricing, and context limits.
 */
export class CapabilityRegistry {
  private models = new Map<string, ModelDescriptor>();

  constructor() {
    this.initDefaultModels();
  }

  private initDefaultModels(): void {
    const defaultModels: ModelDescriptor[] = [
      {
        modelId: "gpt-5.5",
        providerName: "OpenAI",
        capabilities: { toolUse: true, streaming: true, vision: true, audio: true, longContext: true, structuredOutputs: true },
        contextWindowTokens: 128000,
        costPer1kInputTokensUsd: 0.005,
        costPer1kOutputTokensUsd: 0.015,
        isAvailable: true,
      },
      {
        modelId: "gemini-2.5-pro",
        providerName: "GoogleGemini",
        capabilities: { toolUse: true, streaming: true, vision: true, audio: true, longContext: true, structuredOutputs: true },
        contextWindowTokens: 1000000,
        costPer1kInputTokensUsd: 0.0025,
        costPer1kOutputTokensUsd: 0.0075,
        isAvailable: true,
      },
      {
        modelId: "claude-3-5-sonnet",
        providerName: "AnthropicClaude",
        capabilities: { toolUse: true, streaming: true, vision: true, audio: false, longContext: true, structuredOutputs: true },
        contextWindowTokens: 200000,
        costPer1kInputTokensUsd: 0.003,
        costPer1kOutputTokensUsd: 0.015,
        isAvailable: true,
      },
    ];

    defaultModels.forEach((m) => this.models.set(m.modelId, m));
  }

  public registerModel(descriptor: ModelDescriptor): void {
    this.models.set(descriptor.modelId, descriptor);
  }

  public getModel(modelId: string): ModelDescriptor | undefined {
    return this.models.get(modelId);
  }

  public findModelsWithCapabilities(required: Partial<AiCapabilities>): ReadonlyArray<ModelDescriptor> {
    return Array.from(this.models.values()).filter((model) => {
      if (!model.isAvailable) return false;
      for (const [key, val] of Object.entries(required)) {
        if (val && !model.capabilities[key as keyof AiCapabilities]) return false;
      }
      return true;
    });
  }
}
