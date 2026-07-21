import { CredentialEncryption } from './credential-encryption';

export class ApiKeyVault {
  private keys: Map<string, { ciphertext: string; iv: string; authTag: string }> = new Map();

  constructor(private encryption: CredentialEncryption) {}

  storeKey(provider: string, rawKey: string): void {
    if (!rawKey) throw new Error("Key cannot be empty");
    
    const encryptedData = this.encryption.encrypt(rawKey);
    this.keys.set(provider, encryptedData);
    this.persistToSecureStorage(provider, encryptedData);
  }

  retrieveKey(provider: string): string | null {
    const encryptedData = this.keys.get(provider);
    if (!encryptedData) return null;
    
    try {
      return this.encryption.decrypt(encryptedData.ciphertext, encryptedData.iv, encryptedData.authTag);
    } catch (e) {
      console.error(`Failed to decrypt key for ${provider}`);
      return null;
    }
  }

  deleteKey(provider: string): void {
    this.keys.delete(provider);
    this.removeFromSecureStorage(provider);
  }

  hasKey(provider: string): boolean {
    return this.keys.has(provider);
  }

  private persistToSecureStorage(provider: string, data: any): void {
    // Write encrypted blob to disk securely
  }

  private removeFromSecureStorage(provider: string): void {
    // Delete blob
  }
}
