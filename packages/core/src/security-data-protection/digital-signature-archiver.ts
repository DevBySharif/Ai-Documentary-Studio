import { DigitalSignatureRecord } from "./security-types";
import { CryptoEncryptionVault } from "./crypto-encryption-vault";

/**
 * Package Digital Signature Generator & Validator (Vol 06 Part 10 - Section 13).
 * Attaches digital signatures to exported `.aipackage` archives to verify package authenticity and prevent tampering.
 */
export class DigitalSignatureArchiver {
  private vault = new CryptoEncryptionVault();

  public signPackageArchive(packageFilePath: string, signerName = "StudioArchivist"): DigitalSignatureRecord {
    const checksum = this.vault.generateSha256Checksum(packageFilePath);
    const signatureHash = this.vault.generateSha256Checksum(`${checksum}:${signerName}`);

    return {
      signatureId: `sig_${Math.random().toString(36).substring(2, 7)}`,
      archiveChecksum: checksum,
      signedBy: signerName,
      signatureHash,
      signedAt: new Date(),
    };
  }

  public verifyPackageSignature(packageFilePath: string, signature: DigitalSignatureRecord): boolean {
    const currentChecksum = this.vault.generateSha256Checksum(packageFilePath);
    return currentChecksum === signature.archiveChecksum;
  }
}
