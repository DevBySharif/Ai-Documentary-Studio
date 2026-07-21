import { createHash } from "node:crypto";

export class PAContentHashEngine {
  private hashes: Map<string, string> = new Map();

  generateHash(data: Buffer | string): string {
    const hash = createHash("sha256").update(data).digest("hex");
    return hash;
  }

  verifyIntegrity(assetId: string, hash: string): boolean {
    const stored = this.hashes.get(assetId);
    return stored === hash;
  }

  getHash(assetId: string): string | undefined {
    return this.hashes.get(assetId);
  }

  setHash(assetId: string, hash: string): void {
    this.hashes.set(assetId, hash);
  }

  detectChange(assetId: string, newData: Buffer | string): boolean {
    const currentHash = this.generateHash(newData);
    const stored = this.hashes.get(assetId);
    return stored !== currentHash;
  }
}
