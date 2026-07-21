import type { AssetRecord } from "./types.js";

export interface GraphEdge {
  from: string;
  to: string;
  relation: string;
  weight: number;
}

export class AssetRelationshipGraph {
  private edges: GraphEdge[] = [];

  build(assets: AssetRecord[]): void {
    if (!assets) return;
    this.edges = [];

    for (let i = 0; i < assets.length; i++) {
      for (let j = i + 1; j < assets.length; j++) {
        const a = assets[i];
        const b = assets[j];
        if (!a || !b) continue;

        const aTags = a.tags ?? [];
        const bTags = b.tags ?? [];
        const sharedTags = aTags.filter((t) => bTags.includes(t));
        if (sharedTags.length > 0) {
          this.edges.push({
            from: a.assetId,
            to: b.assetId,
            relation: "shared_concept",
            weight: sharedTags.length / Math.max(aTags.length, bTags.length, 1),
          });
        }

        if (a.metadata?.style && a.metadata.style === b.metadata?.style) {
          this.edges.push({
            from: a.assetId,
            to: b.assetId,
            relation: "same_style",
            weight: 0.8,
          });
        }

        if (a.visualDNA?.emotion && a.visualDNA.emotion === b.visualDNA?.emotion) {
          this.edges.push({
            from: a.assetId,
            to: b.assetId,
            relation: "same_emotion",
            weight: 0.7,
          });
        }
      }
    }
  }

  getNeighbors(assetId: string, minWeight = 0.3): GraphEdge[] {
    if (!assetId) return [];
    return this.edges.filter(
      (e) => (e.from === assetId || e.to === assetId) && e.weight >= minWeight
    );
  }

  getRelatedAssetIds(assetId: string, minWeight = 0.3): string[] {
    const neighbors = this.getNeighbors(assetId, minWeight);
    const ids = new Set<string>();
    for (const e of neighbors) {
      if (e.from !== assetId) ids.add(e.from);
      if (e.to !== assetId) ids.add(e.to);
    }
    return Array.from(ids);
  }

  findPath(from: string, to: string): GraphEdge[] {
    if (!from || !to) return [];

    const visited = new Set<string>();
    const queue: Array<{ id: string; path: GraphEdge[] }> = [{ id: from, path: [] }];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.id === to) return current.path;

      if (visited.has(current.id)) continue;
      visited.add(current.id);

      const neighbors = this.getNeighbors(current.id);
      for (const edge of neighbors) {
        const nextId = edge.from === current.id ? edge.to : edge.from;
        if (!visited.has(nextId)) {
          queue.push({ id: nextId, path: [...current.path, edge] });
        }
      }
    }

    return [];
  }

  getEdges(): GraphEdge[] {
    return [...this.edges];
  }
}
