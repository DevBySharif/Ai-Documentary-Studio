import * as crypto from 'crypto';

export class FileIntegrityVerifier {
  private knownHashes: Map<string, string> = new Map();

  registerFile(filePath: string, content: string): void {
    const hash = this.calculateHash(content);
    this.knownHashes.set(filePath, hash);
  }

  verifyFile(filePath: string, currentContent: string): boolean {
    const expectedHash = this.knownHashes.get(filePath);
    if (!expectedHash) return false; // Untracked file

    const currentHash = this.calculateHash(currentContent);
    return currentHash === expectedHash;
  }

  private calculateHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}
