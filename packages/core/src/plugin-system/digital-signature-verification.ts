import { createHash, createSign, createVerify } from 'crypto';

export class PLDigitalSignatureVerification {
  private signatures = new Map<string, string>();
  private signedPackages = new Set<string>();

  signPackage(pluginId: string, privateKey: string): string {
    const sign = createSign('SHA256');
    sign.update(pluginId);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');
    this.signatures.set(pluginId, signature);
    this.signedPackages.add(pluginId);
    return signature;
  }

  verifySignature(pluginId: string, signature: string, publicKey: string): boolean {
    const verify = createVerify('SHA256');
    verify.update(pluginId);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
  }

  verifyPublisherIdentity(pluginId: string): boolean {
    return this.signedPackages.has(pluginId);
  }

  verifyPackageIntegrity(pluginId: string): boolean {
    if (!this.signedPackages.has(pluginId)) return false;
    const stored = this.signatures.get(pluginId);
    return stored !== undefined && stored.length > 0;
  }

  isUnsigned(pluginId: string): boolean {
    return !this.signedPackages.has(pluginId);
  }
}
