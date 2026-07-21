import type { MemoryGraph, MemoryGraphNode, MemoryStore } from "./types.js";

export class ProductionMemoryGraph {
  private nodes = new Map<string, MemoryGraphNode>();
  private edges: MemoryGraph["edges"] = [];

  addNode(id: string, type: MemoryStore, label: string, data: Record<string, unknown>): void {
    this.nodes.set(id, { id, type, label, connections: [], data });
  }

  connect(fromId: string, toId: string, weight: number, label: string): void {
    this.edges.push({ from: fromId, to: toId, weight, label });
    const from = this.nodes.get(fromId);
    const to = this.nodes.get(toId);
    if (from && !from.connections.includes(toId)) from.connections.push(toId);
    if (to && !to.connections.includes(fromId)) to.connections.push(fromId);
  }

  findPath(fromId: string, toId: string): string[] {
    const visited = new Set<string>();
    const queue: Array<{ id: string; path: string[] }> = [{ id: fromId, path: [fromId] }];

    while (queue.length > 0) {
      const { id, path } = queue.shift()!;
      if (id === toId) return path;

      if (!visited.has(id)) {
        visited.add(id);
        const node = this.nodes.get(id);
        if (node) {
          for (const conn of node.connections) {
            if (!visited.has(conn)) {
              queue.push({ id: conn, path: [...path, conn] });
            }
          }
        }
      }
    }

    return [];
  }

  getRelated(type: MemoryStore, id: string): MemoryGraphNode[] {
    const node = this.nodes.get(id);
    if (!node) return [];
    return node.connections
      .map((connId) => this.nodes.get(connId))
      .filter((n): n is MemoryGraphNode => n !== undefined && n.type === type);
  }

  getGraph(): MemoryGraph {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
    };
  }

  size(): { nodes: number; edges: number } {
    return { nodes: this.nodes.size, edges: this.edges.length };
  }
}
