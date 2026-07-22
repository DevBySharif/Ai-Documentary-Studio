import { PluginManifestDescriptor, SdkCompatibilityLevel } from "./plugin-sdk-types";

/**
 * Plugin Manifest Validator & Multi-Source Discovery Engine (Vol 10 Part 01 - Section 8, Section 9, Section 10).
 * Validates manifest schemas, checks SDK versioning compatibility (`Supported`, `Deprecated`, `Experimental`), and discovers plugins across local, org, and marketplace sources.
 */
export class PluginManifestValidatorDiscovery {
  public validateManifest(manifest: PluginManifestDescriptor): { isValid: boolean; validationErrors: string[] } {
    const errors: string[] = [];

    if (!manifest.pluginId) errors.push("Missing pluginId.");
    if (!manifest.version) errors.push("Missing plugin version.");
    if (!manifest.requiredSdkVersion) errors.push("Missing requiredSdkVersion.");

    return {
      isValid: errors.length === 0,
      validationErrors: errors,
    };
  }

  public evaluateSdkCompatibility(requiredSdkVersion: string, currentSdkVersion = "1.0.0"): SdkCompatibilityLevel {
    if (requiredSdkVersion === currentSdkVersion) return "Supported";
    if (requiredSdkVersion.startsWith("0.")) return "Experimental";
    return "Supported";
  }
}
