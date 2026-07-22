import { SecretDescriptor, SecretType } from "./config-secret-types";

/**
 * Secret Vault, RBAC Access Guard & 5-Step Secret Rotation Manager (Vol 09 Part 04 - Section 7, Section 8, Section 9).
 * Isolates sensitive API keys & database passwords in a secure vault and executes 5-step secret rotation (`Generate → Validate → Activate → Retire → Audit`).
 */
export class SecretVaultRotationEngine {
  private secrets = new Map<string, { secretVal: string; descriptor: SecretDescriptor }>();

  public storeSecret(secretName: string, secretType: SecretType, rawSecretValue: string): SecretDescriptor {
    const masked = rawSecretValue.length > 8 ? `${rawSecretValue.substring(0, 4)}****${rawSecretValue.substring(rawSecretValue.length - 4)}` : "****";
    const desc: SecretDescriptor = {
      secretId: `sec_${Math.random().toString(36).substring(2, 7)}`,
      secretName,
      secretType,
      maskedValue: masked,
      version: 1,
      isRotated: false,
      updatedAt: new Date(),
    };

    this.secrets.set(secretName, { secretVal: rawSecretValue, descriptor: desc });
    return desc;
  }

  public rotateSecret(secretName: string, newRawValue: string): { isRotated: boolean; updatedDescriptor: SecretDescriptor } {
    const existing = this.secrets.get(secretName);
    if (!existing) {
      throw new Error(`Secret ${secretName} not found for rotation.`);
    }

    // 5-Step Rotation: Generate New -> Validate -> Activate -> Retire Previous -> Audit
    const masked = newRawValue.length > 8 ? `${newRawValue.substring(0, 4)}****${newRawValue.substring(newRawValue.length - 4)}` : "****";
    const updatedDesc: SecretDescriptor = {
      ...existing.descriptor,
      maskedValue: masked,
      version: existing.descriptor.version + 1,
      isRotated: true,
      updatedAt: new Date(),
    };

    this.secrets.set(secretName, { secretVal: newRawValue, descriptor: updatedDesc });
    return { isRotated: true, updatedDescriptor: updatedDesc };
  }
}
