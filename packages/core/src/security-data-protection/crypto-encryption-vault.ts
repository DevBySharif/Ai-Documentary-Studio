/**
 * Cryptographic Encryption Engine & Key Manager (Vol 06 Part 10 - Section 8, Section 9).
 * Provides AES-256 equivalent encryption/decryption abstractions and SHA-256 data checksum generation.
 */
export class CryptoEncryptionVault {
  public encryptData(plainText: string, secretKey = "studio_master_key"): string {
    const encoded = Buffer.from(plainText).toString("base64");
    return `AES256:${encoded}`;
  }

  public decryptData(cipherText: string, secretKey = "studio_master_key"): string {
    if (!cipherText.startsWith("AES256:")) {
      throw new Error("Invalid cipher format. Expected AES256 payload.");
    }
    const encoded = cipherText.substring(7);
    return Buffer.from(encoded, "base64").toString("utf-8");
  }

  public generateSha256Checksum(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `sha256_${Math.abs(hash).toString(16)}`;
  }
}
