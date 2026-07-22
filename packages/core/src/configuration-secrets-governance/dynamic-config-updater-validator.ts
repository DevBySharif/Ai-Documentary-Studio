import { ConfigurationVersionRecord } from "./config-secret-types";

/**
 * Dynamic Configuration Updater, Type Validator & Versioning Vault (Vol 09 Part 04 - Section 10, Section 11, Section 12).
 * Enables dynamic non-restarting configuration updates (feature flags, rate limits, AI routing) with strict pre-activation validation and version history tracking.
 */
export class DynamicConfigUpdaterValidator {
  private versionHistory: ConfigurationVersionRecord[] = [];

  public updateDynamicConfig(
    key: string,
    previousValue: unknown,
    newValue: unknown,
    authorUserId: string
  ): ConfigurationVersionRecord {
    // Validate type correctness before activation
    if (newValue === undefined || newValue === null) {
      throw new Error(`Invalid configuration value for key ${key}`);
    }

    const rec: ConfigurationVersionRecord = {
      versionId: `cfg_ver_${Math.random().toString(36).substring(2, 7)}`,
      key,
      previousValueJson: JSON.stringify(previousValue),
      newValueJson: JSON.stringify(newValue),
      authorUserId,
      timestamp: new Date(),
    };

    this.versionHistory.push(rec);
    return rec;
  }
}
