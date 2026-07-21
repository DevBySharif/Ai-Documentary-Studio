/**
 * Circular Dependency Detector & DAG Graph Validator (Vol 06 Part 02 - Section 3, Section 6, Section 17).
 * Validates directed acyclic graphs (DAG) across modules and rejects any circular dependency attempts.
 */
export class CircularDependencyDetector {
  private adjacencyList = new Map<string, string[]>();

  public addDependency(fromModule: string, toModule: string): void {
    const existing = this.adjacencyList.get(fromModule) || [];
    this.adjacencyList.set(fromModule, [...existing, toModule]);
  }

  public detectCycle(): { hasCycle: boolean; cyclePath?: string[] } {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    let cyclePath: string[] = [];

    const dfs = (node: string, currentPath: string[]): boolean => {
      visited.add(node);
      recursionStack.add(node);
      const path = [...currentPath, node];

      const neighbors = this.adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor, path)) return true;
        } else if (recursionStack.has(neighbor)) {
          cyclePath = [...path, neighbor];
          return true;
        }
      }

      recursionStack.delete(node);
      return false;
    };

    for (const node of Array.from(this.adjacencyList.keys())) {
      if (!visited.has(node)) {
        if (dfs(node, [])) {
          return { hasCycle: true, cyclePath };
        }
      }
    }

    return { hasCycle: false };
  }
}
