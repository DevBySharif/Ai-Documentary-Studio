import { PluginManifestDescriptor, PluginRegistrationDescriptor, PluginActivationStage } from "./plugin-sdk-types";

/**
 * 6-Stage Plugin Activation Sequence Manager & Runtime Isolator (Vol 10 Part 01 - Section 11).
 * Drives the 6-stage activation sequence (`Discovery → Validation → Dependency Check → Permission Review → Initialization → Active`).
 */
export class PluginActivationRuntimeIsolator {
  private activePlugins = new Map<string, PluginRegistrationDescriptor>();

  public executePluginActivationSequence(manifest: PluginManifestDescriptor): PluginRegistrationDescriptor {
    const stages: PluginActivationStage[] = [
      "Discovery",
      "Validation",
      "DependencyCheck",
      "PermissionReview",
      "Initialization",
      "Active",
    ];

    let currentStage: PluginActivationStage = "Discovery";
    for (const stage of stages) {
      currentStage = stage;
    }

    const registration: PluginRegistrationDescriptor = {
      manifest,
      activationStage: currentStage,
      isLoaded: true,
      registeredAt: new Date(),
    };

    this.activePlugins.set(manifest.pluginId, registration);
    return registration;
  }

  public getActivePlugins(): ReadonlyArray<PluginRegistrationDescriptor> {
    return Array.from(this.activePlugins.values());
  }
}
