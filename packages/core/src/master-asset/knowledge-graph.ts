export interface GraphEdge {
  from: string;
  to: string;
  relationship: string;
  weight: number;
}

export class MasterKnowledgeGraphManager {
  private vertices = new Set<string>();
  private edges: GraphEdge[] = [];

  addAsset(assetId: string): void {
    this.vertices.add(assetId);
  }

  addRelationship(from: string, to: string, relationship: string, weight = 1): void {
    this.vertices.add(from);
    this.vertices.add(to);
    this.edges.push({ from, to, relationship, weight });
  }

  getConnected(assetId: string): string[] {
    const connected = new Set<string>();
    for (const edge of this.edges) {
      if (edge.from === assetId) connected.add(edge.to);
      if (edge.to === assetId) connected.add(edge.from);
    }
    return Array.from(connected);
  }

  findPath(fromId: string, toId: string): string[] {
    const visited = new Set<string>();
    const queue: string[][] = [[fromId]];
    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1];
      if (current === toId) return path;
      if (visited.has(current)) continue;
      visited.add(current);
      for (const edge of this.edges) {
        const next = edge.from === current ? edge.to : edge.to === current ? edge.from : null;
        if (next && !visited.has(next)) queue.push([...path, next]);
      }
    }
    return [];
  }

  getAssetCount(): number {
    return this.vertices.size;
  }

  getEdgeCount(): number {
    return this.edges.length;
  }
}
