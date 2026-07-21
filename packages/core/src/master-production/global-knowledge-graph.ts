import type { MPKnowledgeGraphNode, MPKnowledgeGraphEdge } from "./types.js";

export class MPGlobalKnowledgeGraph {
  private nodes: Map<string, MPKnowledgeGraphNode> = new Map();
  private edges: MPKnowledgeGraphEdge[] = [];

  addNode(id: string, type: string, label: string, properties: Record<string, unknown>): void {
    this.nodes.set(id, { id, type, label, properties });
  }

  addEdge(source: string, target: string, relationship: string, weight: number = 1): void {
    this.edges.push({ source, target, relationship, weight });
  }

  getNode(id: string): MPKnowledgeGraphNode | undefined {
    const node = this.nodes.get(id);
    return node ? { ...node } : undefined;
  }

  getEdgesFrom(source: string): MPKnowledgeGraphEdge[] {
    return this.edges.filter((e) => e.source === source);
  }

  getEdgesTo(target: string): MPKnowledgeGraphEdge[] {
    return this.edges.filter((e) => e.target === target);
  }

  trace(fromId: string, toId: string): MPKnowledgeGraphEdge[] {
    const visited = new Set<string>();
    const queue: string[] = [fromId];
    const path: MPKnowledgeGraphEdge[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const outEdges = this.getEdgesFrom(current);
      for (const edge of outEdges) {
        path.push(edge);
        if (edge.target === toId) return path;
        queue.push(edge.target);
      }
    }

    return path;
  }

  getNodeCount(): number {
    return this.nodes.size;
  }

  getEdgeCount(): number {
    return this.edges.length;
  }

  clear(): void {
    this.nodes.clear();
    this.edges = [];
  }
}
