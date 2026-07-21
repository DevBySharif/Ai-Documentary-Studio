import * as crypto from "crypto";
import * as fs from "fs";

const HASH_ALGORITHM = "sha256";
const STREAM_HIGH_WATER_MARK = 64 * 1024; // 64KB chunks

/**
 * Generates a cryptographic content hash for deduplication and integrity checks.
 * All media access uses streaming to avoid loading entire files into memory.
 */
export class AssetHasher {
  /**
   * Computes the SHA-256 hex digest of a file by streaming it.
   */
  public async hash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hashInstance = crypto.createHash(HASH_ALGORITHM);
      const stream = fs.createReadStream(filePath, {
        highWaterMark: STREAM_HIGH_WATER_MARK,
      });

      stream.on("data", (chunk) => hashInstance.update(chunk));
      stream.on("end", () => resolve(hashInstance.digest("hex")));
      stream.on("error", (err) => reject(err));
    });
  }

  /**
   * Computes a hash directly from a Buffer (for small in-memory assets).
   */
  public hashBuffer(buffer: Buffer): string {
    return crypto.createHash(HASH_ALGORITHM).update(buffer).digest("hex");
  }
}
