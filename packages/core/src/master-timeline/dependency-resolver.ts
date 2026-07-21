import type { MasterEvent, DependencyGraph } from "./types.js";

export class DependencyResolver {
  buildGraph(events: MasterEvent[]): DependencyGraph {
    const nodes = new Map<string, MasterEvent>();
    const edges: Array<{ from: string; to: string }> = [];

    for (const event of events) {
      nodes.set(event.id, event);
      for (const depId of event.dependencies) {
        edges.push({ from: depId, to: event.id });
      }
    }

    return { nodes, edges };
  }

  topoSort(events: MasterEvent[]): MasterEvent[] {
    const adjacency = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    const eventMap = new Map<string, MasterEvent>();

    for (const event of events) {
      eventMap.set(event.id, event);
      if (!adjacency.has(event.id)) adjacency.set(event.id, []);
      if (!inDegree.has(event.id)) inDegree.set(event.id, 0);
    }

    for (const event of events) {
      for (const depId of event.dependencies) {
        if (adjacency.has(depId)) {
          adjacency.get(depId)!.push(event.id);
        }
        inDegree.set(event.id, (inDegree.get(event.id) ?? 0) + 1);
      }
    }

    const queue: string[] = [];
    for (const [id, degree] of inDegree) {
      if (degree === 0) queue.push(id);
    }

    const sorted: MasterEvent[] = [];
    while (queue.length > 0) {
      const id = queue.shift()!;
      const event = eventMap.get(id);
      if (event) sorted.push(event);

      for (const neighbor of adjacency.get(id) ?? []) {
        const newDegree = (inDegree.get(neighbor) ?? 1) - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) queue.push(neighbor);
      }
    }

    return sorted;
  }

  findCycle(events: MasterEvent[]): string[] {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycle: string[] = [];

    const dfs = (id: string): boolean => {
      visited.add(id);
      recursionStack.add(id);

      const event = events.find((e) => e.id === id);
      if (event) {
        for (const depId of event.dependencies) {
          if (!visited.has(depId)) {
            if (dfs(depId)) {
              cycle.push(id);
              return true;
            }
          } else if (recursionStack.has(depId)) {
            cycle.push(id, depId);
            return true;
          }
        }
      }

      recursionStack.delete(id);
      return false;
    };

    for (const event of events) {
      if (!visited.has(event.id)) {
        if (dfs(event.id)) break;
      }
    }

    return cycle;
  }
}
