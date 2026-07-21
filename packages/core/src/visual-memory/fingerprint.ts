import type { ImageFingerprintData } from "./types.js";

export class ImageFingerprintGenerator {
  generate(assetId: string, _imageData: string): ImageFingerprintData {
    if (!assetId) throw new Error("assetId is required for fingerprint generation");

    const hash = this.simulateHash(assetId);
    return {
      assetId,
      imageHash: `img_${hash}`,
      perceptualHash: `phash_${hash}`,
      differenceHash: `dhash_${hash}`,
      averageHash: `ahash_${hash}`,
      embeddingId: `emb_${assetId.toLowerCase()}`,
    };
  }

  compareHashes(a: Pick<ImageFingerprintData, "perceptualHash" | "differenceHash" | "averageHash">, b: Pick<ImageFingerprintData, "perceptualHash" | "differenceHash" | "averageHash">): number {
    if (!a || !b) throw new Error("Both hash sets are required for comparison");

    const pDist = this.hammingDistance(a.perceptualHash ?? "", b.perceptualHash ?? "");
    const dDist = this.hammingDistance(a.differenceHash ?? "", b.differenceHash ?? "");
    const aDist = this.hammingDistance(a.averageHash ?? "", b.averageHash ?? "");

    const totalDist = pDist + dDist + aDist;
    const maxDist = (a.perceptualHash?.length ?? 1) * 8 + (a.differenceHash?.length ?? 1) * 8 + (a.averageHash?.length ?? 1) * 8;
    return Math.round((1 - totalDist / Math.max(1, maxDist)) * 100);
  }

  private simulateHash(seed: string): string {
    if (!seed) return "00000000";
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, "0");
  }

  private hammingDistance(a: string, b: string): number {
    let dist = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] !== b[i]) dist++;
    }
    return dist + Math.abs(a.length - b.length);
  }
}
