import type { ProductionKnowledgeGraph, ProductionKnowledgeGraphNode } from "./types.js";

export class ProductionKnowledgeGraphEngine {
  private graph: ProductionKnowledgeGraph = { nodes: [], edges: [] };

  addNode(node: ProductionKnowledgeGraphNode): void {
    if (!node?.id) throw new Error("KnowledgeGraphNode with id is required");
    this.graph.nodes.push(node);
  }

  addEdge(from: string, to: string, type: string): void {
    this.graph.edges.push({ from, to, type });
  }

  getNode(id: string): ProductionKnowledgeGraphNode | undefined {
    return this.graph.nodes.find((n) => n.id === id);
  }

  findPath(fromId: string, toId: string): ProductionKnowledgeGraphNode[] {
    const visited = new Set<string>();
    const queue: string[][] = [[fromId]];

    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1];
      if (current === toId) return path.map((id) => this.graph.nodes.find((n) => n.id === id)!);
      if (visited.has(current)) continue;
      visited.add(current);
      const neighbors = this.graph.edges
        .filter((e) => e.from === current)
        .map((e) => e.to);
      for (const n of neighbors) {
        queue.push([...path, n]);
      }
    }
    return [];
  }

  getConnected(projectId: string): ProductionKnowledgeGraphNode[] {
    const connectedIds = new Set<string>();
    for (const edge of this.graph.edges) {
      if (edge.from === projectId) connectedIds.add(edge.to);
      if (edge.to === projectId) connectedIds.add(edge.from);
    }
    return this.graph.nodes.filter((n) => connectedIds.has(n.id));
  }

  getGraph(): ProductionKnowledgeGraph {
    return { ...this.graph, nodes: [...this.graph.nodes], edges: [...this.graph.edges] };
  }
}
