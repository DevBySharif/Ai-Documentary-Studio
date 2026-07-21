import type { AssetRecord, DuplicateReport } from "./types.js";

export class DuplicateDetector {
  detectExact(asset: AssetRecord, candidates: AssetRecord[]): DuplicateReport[] {
    if (!asset || !candidates) return [];

    const reports: DuplicateReport[] = [];
    for (const candidate of candidates) {
      if (!candidate || candidate.assetId === asset.assetId) continue;
      if (candidate.prompt === asset.prompt && candidate.negativePrompt === asset.negativePrompt) {
        reports.push({
          type: "exact",
          sourceAssetId: asset.assetId,
          matchAssetId: candidate.assetId,
          confidence: 99,
          reason: "Identical prompt and negative prompt",
        });
      }
    }
    return reports;
  }

  detectNearDuplicate(asset: AssetRecord, candidates: AssetRecord[]): DuplicateReport[] {
    if (!asset || !candidates) return [];

    const reports: DuplicateReport[] = [];
    for (const candidate of candidates) {
      if (!candidate || candidate.assetId === asset.assetId) continue;
      const promptSim = this.similarity(asset.prompt ?? "", candidate.prompt ?? "");
      if (promptSim > 0.85) {
        reports.push({
          type: "near_duplicate",
          sourceAssetId: asset.assetId,
          matchAssetId: candidate.assetId,
          confidence: Math.round(promptSim * 100),
          reason: `Prompt similarity ${Math.round(promptSim * 100)}%`,
        });
      }
    }
    return reports;
  }

  detectCompositionDuplicate(asset: AssetRecord, candidates: AssetRecord[]): DuplicateReport[] {
    if (!asset || !candidates) return [];

    const reports: DuplicateReport[] = [];
    for (const candidate of candidates) {
      if (!candidate || candidate.assetId === asset.assetId) continue;
      if ((asset.metadata?.aspectRatio ?? "") === (candidate.metadata?.aspectRatio ?? "") &&
          (asset.visualDNA?.camera ?? "") === (candidate.visualDNA?.camera ?? "")) {
        reports.push({
          type: "composition",
          sourceAssetId: asset.assetId,
          matchAssetId: candidate.assetId,
          confidence: 70,
          reason: "Same aspect ratio and camera angle",
        });
      }
    }
    return reports;
  }

  detectPromptDuplicate(asset: AssetRecord, candidates: AssetRecord[]): DuplicateReport[] {
    if (!asset || !candidates) return [];

    const reports: DuplicateReport[] = [];
    for (const candidate of candidates) {
      if (!candidate || candidate.assetId === asset.assetId) continue;
      if (candidate.prompt === asset.prompt) {
        reports.push({
          type: "prompt",
          sourceAssetId: asset.assetId,
          matchAssetId: candidate.assetId,
          confidence: 95,
          reason: "Identical prompt text",
        });
      }
    }
    return reports;
  }

  detectConceptDuplicate(asset: AssetRecord, candidates: AssetRecord[]): DuplicateReport[] {
    if (!asset || !candidates) return [];

    const reports: DuplicateReport[] = [];
    for (const candidate of candidates) {
      if (!candidate || candidate.assetId === asset.assetId) continue;
      const aTags = asset.tags ?? [];
      const bTags = candidate.tags ?? [];
      const sharedTags = aTags.filter((t) => bTags.includes(t));
      if (sharedTags.length >= 3) {
        reports.push({
          type: "concept",
          sourceAssetId: asset.assetId,
          matchAssetId: candidate.assetId,
          confidence: Math.round((sharedTags.length / Math.max(aTags.length, 1)) * 100),
          reason: `Shared tags: ${sharedTags.join(", ")}`,
        });
      }
    }
    return reports;
  }

  detectAll(asset: AssetRecord, candidates: AssetRecord[]): DuplicateReport[] {
    if (!asset || !candidates) return [];
    return [
      ...this.detectExact(asset, candidates),
      ...this.detectNearDuplicate(asset, candidates),
      ...this.detectCompositionDuplicate(asset, candidates),
      ...this.detectPromptDuplicate(asset, candidates),
      ...this.detectConceptDuplicate(asset, candidates),
    ];
  }

  private similarity(a: string, b: string): number {
    const sa = a ?? "";
    const sb = b ?? "";
    const longer = sa.length >= sb.length ? sa : sb;
    const shorter = sa.length < sb.length ? sa : sb;
    if (longer.length === 0) return 1.0;

    const costs: number[] = [];
    for (let i = 0; i <= shorter.length; i++) costs[i] = i;

    for (let i = 1; i <= longer.length; i++) {
      costs[0] = i;
      let prev = i - 1;
      for (let j = 1; j <= shorter.length; j++) {
        const cost = sa[i - 1] === sb[j - 1] ? prev : 1 + Math.min(costs[j], costs[j - 1], prev);
        prev = costs[j];
        costs[j] = cost;
      }
    }

    const dist = costs[shorter.length];
    return 1 - dist / longer.length;
  }
}
