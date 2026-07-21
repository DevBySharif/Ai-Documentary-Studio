import type { PAAssetRelationship, PARelationshipType } from "./types.js";

export class PAAssetRelationshipGraph {
  private relationships: PAAssetRelationship[] = [];

  addRelationship(source: string, target: string, type: PARelationshipType): void {
    this.relationships.push({ sourceAssetId: source, targetAssetId: target, relationshipType: type });
  }

  removeRelationship(source: string, target: string): void {
    this.relationships = this.relationships.filter(
      (r) => !(r.sourceAssetId === source && r.targetAssetId === target)
    );
  }

  getDependencies(assetId: string): PAAssetRelationship[] {
    return this.relationships.filter((r) => r.targetAssetId === assetId);
  }

  getDependents(assetId: string): PAAssetRelationship[] {
    return this.relationships.filter((r) => r.sourceAssetId === assetId);
  }

  getImpactChain(assetId: string): string[][] {
    const levels: string[][] = [];
    let current: string[] = [assetId];
    const visited = new Set<string>();

    while (current.length > 0) {
      const next: string[] = [];
      for (const id of current) {
        visited.add(id);
        const deps = this.getDependencies(id);
        for (const dep of deps) {
          if (!visited.has(dep.sourceAssetId)) {
            next.push(dep.sourceAssetId);
          }
        }
      }
      if (next.length > 0) levels.push([...next]);
      current = next;
    }
    return levels;
  }

  hasCyclicDependency(assetId: string): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (id: string): boolean => {
      visited.add(id);
      recursionStack.add(id);
      const deps = this.getDependencies(id);
      for (const dep of deps) {
        if (!visited.has(dep.sourceAssetId)) {
          if (dfs(dep.sourceAssetId)) return true;
        } else if (recursionStack.has(dep.sourceAssetId)) {
          return true;
        }
      }
      recursionStack.delete(id);
      return false;
    };

    return dfs(assetId);
  }
}
