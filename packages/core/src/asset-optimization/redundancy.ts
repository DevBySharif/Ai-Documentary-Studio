import type { RedundancyCluster } from "./types.js";

export class RedundancyDetector {
  detectImages(images: Array<{ id: string; perceptualHash: string }>): RedundancyCluster[] {
    const clusters: RedundancyCluster[] = [];
    const grouped = new Map<string, string[]>();

    for (const img of images) {
      const existing = Array.from(grouped.entries()).find(([, ids]) =>
        this.isNearDuplicate(img.perceptualHash, ids[0])
      );
      if (existing) {
        existing[1].push(img.id);
      } else {
        grouped.set(img.id, [img.id]);
      }
    }

    let clusterId = 0;
    for (const [, ids] of grouped) {
      if (ids.length > 1) {
        clusters.push({
          clusterId: `redundancy_${clusterId++}`,
          assetIds: ids,
          type: "image",
          recommendedAction: "keep_best"
        });
      }
    }

    return clusters;
  }

  private isNearDuplicate(hashA: string, hashB: string, threshold = 0.9): boolean {
    if (hashA.length !== hashB.length) return false;
    let matches = 0;
    for (let i = 0; i < hashA.length; i++) {
      if (hashA[i] === hashB[i]) matches++;
    }
    return matches / hashA.length >= threshold;
  }
}
