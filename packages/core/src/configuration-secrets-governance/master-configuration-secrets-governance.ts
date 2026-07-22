import { PrecedenceHierarchyConfigManager } from "./precedence-hierarchy-config-manager";
import { SecretVaultRotationEngine } from "./secret-vault-rotation-engine";
import { DynamicConfigUpdaterValidator } from "./dynamic-config-updater-validator";
import { MaskedConfigAuditLogger } from "./masked-config-audit-logger";
import { SecretType } from "./config-secret-types";

/**
 * Master Configuration Secrets Governance Engine (Main Vol 09 Part 04).
 * Core entry point for 5-layer configuration architecture (`Application → Configuration Service → Secret Manager → Environment Profiles → Infrastructure`).
 */
export class MasterConfigurationSecretsGovernance {
  public readonly configManager = new PrecedenceHierarchyConfigManager();
  public readonly secretVault = new SecretVaultRotationEngine();
  public readonly dynamicUpdater = new DynamicConfigUpdaterValidator();
  public readonly auditLogger = new MaskedConfigAuditLogger();

  public registerSecretAndAudit(secretName: string, secretType: SecretType, rawValue: string, userId: string): void {
    const desc = this.secretVault.storeSecret(secretName, secretType, rawValue);
    this.auditLogger.logConfigChange(secretName, userId, "Security", "DeploymentProfile", `Secret stored version ${desc.version}`);
  }
}
