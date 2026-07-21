import { ConfigHierarchyResolver } from "./config-hierarchy-resolver";
import { FeatureFlagsEnvironmentProfile } from "./feature-flags-environment-profile";
import { SecureSecretStorageVault } from "./secure-secret-storage-vault";
import { ConfigSchemaValidatorMigrator } from "./config-schema-validator-migrator";
import { DynamicRuntimeSettingsNotifier } from "./dynamic-runtime-settings-notifier";

/**
 * Master Configuration Engine (Main Vol 06 Part 08).
 * Core entry point for configuration management, 5-level hierarchy resolution, feature flags, secret vault, schema validation, dynamic runtime updates, and safe defaults.
 */
export class MasterConfigurationEngine {
  public readonly resolver = new ConfigHierarchyResolver();
  public readonly featureFlags = new FeatureFlagsEnvironmentProfile();
  public readonly secretVault = new SecureSecretStorageVault();
  public readonly validatorMigrator = new ConfigSchemaValidatorMigrator();
  public readonly runtimeNotifier = new DynamicRuntimeSettingsNotifier();

  public getConfigurationDiagnostics(): {
    activeEnvironment: string;
    resolvedTheme: string;
    auditEntriesCount: number;
  } {
    const themeRes = this.resolver.resolveSetting<string>("theme");
    return {
      activeEnvironment: this.featureFlags.getEnvironmentProfile(),
      resolvedTheme: themeRes.value,
      auditEntriesCount: this.runtimeNotifier.getAuditHistory().length,
    };
  }
}
