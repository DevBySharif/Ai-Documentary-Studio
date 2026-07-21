/**
 * Secret Vault & API Key Manager (IB Part 23 - Section 6, Section 7, Section 21).
 * Zero plain-text secrets in logs or diagnostics. Sensitive values are masked.
 */
export class SecretVault {
  private secrets = new Map<string, string>();

  public storeSecret(key: string, plainTextValue: string): void {
    // Encrypt in-memory value using base64 mock encryption
    const encrypted = Buffer.from(plainTextValue, "utf-8").toString("base64");
    this.secrets.set(key, encrypted);
  }

  public retrieveSecret(key: string): string | undefined {
    const encrypted = this.secrets.get(key);
    if (!encrypted) return undefined;
    return Buffer.from(encrypted, "base64").toString("utf-8");
  }

  public maskSecret(key: string): string {
    const val = this.retrieveSecret(key);
    if (!val) return "******";
    if (val.length <= 8) return "********";
    return `${val.substring(0, 4)}...${val.substring(val.length - 4)}`;
  }

  public revokeSecret(key: string): void {
    this.secrets.delete(key);
  }
}
