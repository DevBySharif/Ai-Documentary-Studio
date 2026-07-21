import { ProviderAdapterContract } from "./provider-adapter-contract";
import { AiCapabilityType, ModelDescriptor } from "./orchestration-types";

/**
 * Provider Registry & Model Registry Manager (Vol 06 Part 06 - Section 6, Section 7).
 * Maintains installed provider adapters, capability mappings, and model definitions.
 */
export class ProviderModelRegistry {
  private providers = new Map<string, ProviderAdapterContract>();
  private models = new Map<string, ModelDescriptor[]>();

  public registerProvider(adapter: ProviderAdapterContract, models: ModelDescriptor[]): void {
    this.providers.set(adapter.providerId, adapter);
    this.models.set(adapter.providerId, models);
  }

  public getProvidersForCapability(capability: AiCapabilityType): ReadonlyArray<ProviderAdapterContract> {
    return Array.from(this.providers.values()).filter((p) => p.supportedCapabilities.includes(capability));
  }

  public getModelsForProvider(providerId: string): ReadonlyArray<ModelDescriptor> {
    return this.models.get(providerId) || [];
  }
}
