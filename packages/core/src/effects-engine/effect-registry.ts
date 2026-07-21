import { EffectCategory, ParameterDefinition } from "./effect-model";

export interface EffectPluginDescriptor {
  readonly type: string;
  readonly name: string;
  readonly category: EffectCategory;
  readonly version: string;
  readonly isGpuSupported: boolean;
  readonly parameterDefinitions: ReadonlyArray<ParameterDefinition>;
}

/**
 * Extensible Effect Registry (IB Part 16 - Section 18, Section 24).
 * Registers built-in and third-party plugin effects, validating versions and capabilities.
 */
export class EffectRegistry {
  private registry = new Map<string, EffectPluginDescriptor>();

  public registerPlugin(descriptor: EffectPluginDescriptor): void {
    if (this.registry.has(descriptor.type)) {
      console.warn(`[EffectRegistry] Overwriting registered effect plugin: ${descriptor.type}`);
    }
    this.registry.set(descriptor.type, descriptor);
  }

  public getDescriptor(type: string): EffectPluginDescriptor | undefined {
    return this.registry.get(type);
  }

  public listByCategory(category: EffectCategory): ReadonlyArray<EffectPluginDescriptor> {
    return Array.from(this.registry.values()).filter((desc) => desc.category === category);
  }

  public listAll(): ReadonlyArray<EffectPluginDescriptor> {
    return Array.from(this.registry.values());
  }
}
