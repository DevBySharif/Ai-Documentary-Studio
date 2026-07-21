import type { PerceptualHashSet } from "./types.js";

export class PerceptualHashMatcher {
  private hashes = new Map<string, PerceptualHashSet>();

  register(hashSet: PerceptualHashSet): void {
    this.hashes.set(hashSet.assetId, hashSet);
  }

  findExactMatch(target: PerceptualHashSet): string | null {
    for (const [, existing] of this.hashes) {
      if (existing.perceptualHash === target.perceptualHash &&
          existing.differenceHash === target.differenceHash &&
          existing.averageHash === target.averageHash) {
        return existing.assetId;
      }
    }
    return null;
  }

  findNearMatches(target: PerceptualHashSet, threshold = 90): Array<{ assetId: string; similarity: number }> {
    const results: Array<{ assetId: string; similarity: number }> = [];

    for (const [, existing] of this.hashes) {
      const similarity = this.compare(target, existing);
      if (similarity >= threshold) {
        results.push({ assetId: existing.assetId, similarity });
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  compare(a: PerceptualHashSet, b: PerceptualHashSet): number {
    const pHashDist = this.hammingDistance(a.perceptualHash, b.perceptualHash);
    const dHashDist = this.hammingDistance(a.differenceHash, b.differenceHash);
    const aHashDist = this.hammingDistance(a.averageHash, b.averageHash);

    const pHashSim = Math.max(0, 100 - pHashDist * 5);
    const dHashSim = Math.max(0, 100 - dHashDist * 5);
    const aHashSim = Math.max(0, 100 - aHashDist * 5);

    return Math.round((pHashSim + dHashSim + aHashSim) / 3);
  }

  private hammingDistance(a: string, b: string): number {
    let dist = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] !== b[i]) dist++;
    }
    return dist + Math.abs(a.length - b.length);
  }
}
