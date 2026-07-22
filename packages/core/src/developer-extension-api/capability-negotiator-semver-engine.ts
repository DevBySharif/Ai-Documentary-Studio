import { SemVerVersion, CapabilityNegotiationReport } from "./developer-api-types";

/**
 * Capability Negotiator Engine & SemVer API Versioning Evaluator (Vol 10 Part 02 - Section 8, Section 9).
 * Evaluates SemVer version compatibility (`Major.Minor.Patch`) and negotiates plugin capabilities prior to activation.
 */
export class CapabilityNegotiatorSemverEngine {
  public evaluateSemVerCompatibility(requiredVersion: SemVerVersion, currentVersion: SemVerVersion): boolean {
    // Breaking change if major versions differ
    if (requiredVersion.major !== currentVersion.major) {
      return false;
    }
    return currentVersion.minor >= requiredVersion.minor;
  }

  public negotiateCapabilities(
    pluginId: string,
    requestedCapabilities: ReadonlyArray<string>,
    availableCapabilities: ReadonlyArray<string>
  ): CapabilityNegotiationReport {
    const missing = requestedCapabilities.filter((c) => !availableCapabilities.includes(c));

    return {
      pluginId,
      isCompatible: missing.length === 0,
      missingCapabilities: missing,
      missingPermissions: [],
    };
  }
}
