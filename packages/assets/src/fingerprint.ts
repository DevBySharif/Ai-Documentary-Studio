import { createHash } from 'crypto';

export class AssetFingerprintEngine {
  /**
   * Generates a SHA-256 content hash for a given binary buffer.
   * This hash is the canonical identity of the asset used for deduplication.
   */
  static computeHash(buffer: Buffer): string {
    const hash = createHash('sha256');
    hash.update(buffer);
    return `sha256:${hash.digest('hex')}`;
  }

  /**
   * Infers basic MIME/extension info if possible.
   * In a real implementation, you might use 'file-type' package, but we stub it here.
   */
  static inferMimeType(buffer: Buffer, fallbackExtension: string): { mimeType: string, extension: string } {
    // Simple stub. A real app would read the magic numbers of the buffer.
    const ext = fallbackExtension.startsWith('.') ? fallbackExtension.slice(1) : fallbackExtension;
    let mimeType = 'application/octet-stream';
    
    switch(ext.toLowerCase()) {
      case 'png': mimeType = 'image/png'; break;
      case 'jpg':
      case 'jpeg': mimeType = 'image/jpeg'; break;
      case 'mp4': mimeType = 'video/mp4'; break;
      case 'mp3': mimeType = 'audio/mpeg'; break;
      case 'wav': mimeType = 'audio/wav'; break;
    }
    
    return { mimeType, extension: ext };
  }
}
