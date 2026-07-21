import type { WMDependencyNode } from "./types.js";

export class WMProjectDependencyMap {
  private nodes: Map<string, WMDependencyNode> = new Map();

  addNode(id: string, type: string, label: string, children: string[], parents: string[]): void {
    this.nodes.set(id, { id, type, label, children, parents });
  }

  getNode(id: string): WMDependencyNode | undefined {
    return this.nodes.get(id);
  }

  getDownstream(id: string): string[] {
    const result: string[] = [];
    const queue = [id];
    while (queue.length > 0) {
      const current = queue.shift()!;
      const node = this.nodes.get(current);
      if (node) {
        for (const child of node.children) {
          if (!result.includes(child)) {
            result.push(child);
            queue.push(child);
          }
        }
      }
    }
    return result;
  }

  clear(): void {
    this.nodes.clear();
  }
}
