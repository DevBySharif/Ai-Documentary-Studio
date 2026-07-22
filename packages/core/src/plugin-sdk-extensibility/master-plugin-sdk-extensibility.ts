import { PlatformSdkContracts } from "./platform-sdk-contracts";
import { ExtensionPointLifecycleBus } from "./extension-point-lifecycle-bus";
import { PluginManifestValidatorDiscovery } from "./plugin-manifest-validator-discovery";
import { PluginActivationRuntimeIsolator } from "./plugin-activation-runtime-isolator";
import { PluginManifestDescriptor } from "./plugin-sdk-types";

/**
 * Master Plugin SDK Extensibility Engine (Main Vol 10 Part 01).
 * Core entry point for 5-layer extensibility architecture (`Core Platform → Extension Manager → Plugin SDK → Plugin Runtime → Extensions`).
 */
export class MasterPluginSdkExtensibility {
  public readonly sdkContracts = new PlatformSdkContracts();
  public readonly lifecycleBus = new ExtensionPointLifecycleBus();
  public readonly manifestDiscovery = new PluginManifestValidatorDiscovery();
  public readonly activationIsolator = new PluginActivationRuntimeIsolator();

  public registerAndActivatePlugin(manifest: PluginManifestDescriptor): ReturnType<PluginActivationRuntimeIsolator["executePluginActivationSequence"]> {
    const validation = this.manifestDiscovery.validateManifest(manifest);
    if (!validation.isValid) {
      throw new Error(`Plugin validation failed: ${validation.validationErrors.join(", ")}`);
    }

    return this.activationIsolator.executePluginActivationSequence(manifest);
  }
}
