import type { AssetRecord, AssetHealthReport } from "./types.js";

export class AssetHealthScorer {
  score(asset: AssetRecord): AssetHealthReport {
    if (!asset) throw new Error("AssetRecord is required");

    const quality = this.scoreQuality(asset);
    const resolution = this.scoreResolution(asset);
    const sharpness = this.scoreSharpness(asset);
    const styleConsistency = this.scoreStyleConsistency(asset);
    const reuseValue = this.scoreReuseValue(asset);

    const overallHealth = Math.round((quality + resolution + sharpness + styleConsistency + reuseValue) / 5);

    return {
      assetId: asset.assetId,
      quality,
      resolution,
      sharpness,
      styleConsistency,
      reuseValue,
      overallHealth,
      needsRegeneration: overallHealth < 50,
    };
  }

  private scoreQuality(asset: AssetRecord): number {
    return Math.min(100, (asset.qualityScore ?? 50) + 5);
  }

  private scoreResolution(asset: AssetRecord): number {
    const meta = asset.metadata;
    if (!meta) return 60;
    const ratio = meta.aspectRatio ?? "16:9";
    if (ratio.startsWith("4") || ratio.startsWith("16")) return 85;
    if (ratio.startsWith("9")) return 70;
    if (ratio.startsWith("1")) return 75;
    return 60;
  }

  private scoreSharpness(asset: AssetRecord): number {
    return Math.min(100, asset.metadata?.qualityScore ?? 50);
  }

  private scoreStyleConsistency(asset: AssetRecord): number {
    return (asset.metadata?.qualityScore ?? 50) >= 80 ? 90 : 60;
  }

  private scoreReuseValue(asset: AssetRecord): number {
    let score = 50;
    const reuseCount = asset.reuseCount ?? 0;
    if (reuseCount > 10) score += 30;
    else if (reuseCount > 5) score += 20;
    else if (reuseCount > 2) score += 10;

    if (asset.isFavorite) score += 15;
    if ((asset.metadata?.qualityScore ?? 50) >= 85) score += 10;

    return Math.min(100, score);
  }

  getLowHealthAssets(assets: AssetRecord[], threshold = 50): AssetRecord[] {
    if (!assets) return [];
    return assets.filter((a) => {
      if (!a) return false;
      const report = this.score(a);
      return report.overallHealth < threshold;
    });
  }

  getHighValueAssets(assets: AssetRecord[], threshold = 80): AssetRecord[] {
    if (!assets) return [];
    return assets.filter((a) => {
      if (!a) return false;
      const report = this.score(a);
      return report.overallHealth >= threshold;
    });
  }
}
