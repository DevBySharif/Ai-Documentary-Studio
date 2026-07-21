import type { AssetRecord, AssetSearchQuery, AssetSearchResult } from "./types.js";

export class SmartSearchEngine {
  search(assets: AssetRecord[], query: AssetSearchQuery): AssetSearchResult[] {
    if (!assets) throw new Error("Assets array is required");
    if (!query) throw new Error("Search query is required");
    if (!query.query && !query.imageQuery) throw new Error("Search requires either query text or imageQuery");

    let results = assets;

    if (query.channelId) {
      results = results.filter((a) => a.channelId === query.channelId);
    }

    if (query.status) {
      results = results.filter((a) => a.status === query.status);
    }

    if (query.minQuality !== undefined && typeof query.minQuality === "number") {
      results = results.filter((a) => (a.qualityScore ?? 0) >= query.minQuality!);
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter((a) => query.tags!.some((t) => (a.tags ?? []).includes(t)));
    }

    if (query.collections && query.collections.length > 0) {
      results = results.filter((a) => query.collections!.some((c) => (a.collections ?? []).includes(c)));
    }

    return results
      .map((asset) => ({
        asset,
        score: this.calculateScore(asset, query),
        matchedOn: this.findMatches(asset, query),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  keywordSearch(assets: AssetRecord[], keyword: string): AssetSearchResult[] {
    return this.search(assets, { method: "keyword", query: keyword });
  }

  conceptSearch(assets: AssetRecord[], concept: string): AssetSearchResult[] {
    return this.search(assets, { method: "concept", query: concept });
  }

  emotionSearch(assets: AssetRecord[], emotion: string): AssetSearchResult[] {
    return this.search(assets, { method: "emotion", query: emotion });
  }

  styleSearch(assets: AssetRecord[], style: string): AssetSearchResult[] {
    return this.search(assets, { method: "style", query: style });
  }

  private calculateScore(asset: AssetRecord, query: AssetSearchQuery): number {
    const lower = (query.query ?? "").toLowerCase();
    const tags = asset.tags ?? [];
    const metadata = asset.metadata ?? {} as AssetRecord["metadata"];
    let score = 0;

    if ((asset.assetId ?? "").toLowerCase().includes(lower)) score += 50;
    if ((asset.prompt ?? "").toLowerCase().includes(lower)) score += 40;
    if (tags.some((t) => (t ?? "").toLowerCase().includes(lower))) score += 30;
    if ((metadata.style ?? "").toLowerCase().includes(lower)) score += 25;
    if ((metadata.model ?? "").toLowerCase().includes(lower)) score += 20;

    if (query.imageQuery && asset.embedding && asset.embedding.length > 0) {
      score += 15;
    }

    return Math.min(100, score);
  }

  private findMatches(asset: AssetRecord, query: AssetSearchQuery): string[] {
    const lower = (query.query ?? "").toLowerCase();
    const matched: string[] = [];
    const tags = asset.tags ?? [];
    const metadata = asset.metadata ?? {} as AssetRecord["metadata"];

    if ((asset.assetId ?? "").toLowerCase().includes(lower)) matched.push("asset_id");
    if ((asset.prompt ?? "").toLowerCase().includes(lower)) matched.push("prompt");
    if (tags.some((t) => (t ?? "").toLowerCase().includes(lower))) matched.push("tags");
    if ((metadata.style ?? "").toLowerCase().includes(lower)) matched.push("style");

    return matched;
  }
}
