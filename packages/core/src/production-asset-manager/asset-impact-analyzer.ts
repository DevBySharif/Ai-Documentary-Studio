import type { PAAssetRelationship } from "./types.js";

export class PAAssetImpactAnalyzer {
  private relationships: PAAssetRelationship[] = [];

  setRelationships(rels: PAAssetRelationship[]): void {
    this.relationships = rels;
  }

  getImpactChain(assetId: string): { direct: PAAssetRelationship[]; indirect: PAAssetRelationship[] } {
    const direct = this.relationships.filter((r) => r.targetAssetId === assetId || r.sourceAssetId === assetId);
    const visited = new Set<string>([assetId]);
    const indirect: PAAssetRelationship[] = [];

    const traverse = (currentId: string): void => {
      for (const rel of this.relationships) {
        if (rel.sourceAssetId === currentId && !visited.has(rel.targetAssetId)) {
          visited.add(rel.targetAssetId);
          indirect.push(rel);
          traverse(rel.targetAssetId);
        }
        if (rel.targetAssetId === currentId && !visited.has(rel.sourceAssetId)) {
          visited.add(rel.sourceAssetId);
          indirect.push(rel);
          traverse(rel.sourceAssetId);
        }
      }
    };

    traverse(assetId);
    return { direct, indirect };
  }

  getImpactSummary(assetId: string): string {
    const { direct, indirect } = this.getImpactChain(assetId);
    return `Asset ${assetId} has ${direct.length} direct and ${indirect.length} indirect relationships`;
  }

  estimateRegenerationCost(assetId: string): { assets: number; estimatedTime: number } {
    const { direct, indirect } = this.getImpactChain(assetId);
    const totalAssets = direct.length + indirect.length;
    return { assets: totalAssets, estimatedTime: totalAssets * 5 };
  }
}
