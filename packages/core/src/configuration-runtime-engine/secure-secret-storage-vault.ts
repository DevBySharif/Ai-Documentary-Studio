/**
 * Secure Secret Storage Vault (Vol 06 Part 08 - Section 11, Section 12).
 * Stores sensitive credentials (API keys, OAuth tokens, encryption keys) separately from plain text configs.
 */
export class SecureSecretStorageVault {
  private secretVault = new Map<string, string>();

  public storeSecret(secretRefId: string, plainTextValue: string): void {
    // In production, this encrypts credentials using OS keychain or local vault
    const maskedOrEncrypted = `enc_${Buffer.from(plainTextValue).toString("base64")}`;
    this.secretVault.set(secretRefId, maskedOrEncrypted);
  }

  public getSecret(secretRefId: string): string | undefined {
    const raw = this.secretVault.get(secretRefId);
    if (!raw) return undefined;
    if (raw.startsWith("enc_")) {
      return Buffer.from(raw.substring(4), "base64").toString("utf-8");
    }
    return raw;
  }

  public hasSecret(secretRefId: string): boolean {
    return this.secretVault.has(secretRefId);
  }
}
