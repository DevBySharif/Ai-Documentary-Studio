import type { ProductionGraph, ProductionGraphNode } from "./types.js";
import type { MasterEvent } from "./types.js";

export class ProductionGraphBuilder {
  build(events: MasterEvent[]): ProductionGraph {
    const nodes: ProductionGraphNode[] = [];
    const edges: Array<{ from: string; to: string; type: string }> = [];

    const storyNode: ProductionGraphNode = {
      id: "story", type: "story",
      connections: ["concept"],
      data: { eventCount: events.length },
    };
    nodes.push(storyNode);

    const concepts = new Set(events.map((e) => e.data?.concept as string).filter(Boolean));
    const conceptNode: ProductionGraphNode = {
      id: "concept", type: "concept",
      connections: ["image", "timeline"],
      data: { conceptCount: concepts.size, concepts: Array.from(concepts) },
    };
    nodes.push(conceptNode);
    edges.push({ from: "story", to: "concept", type: "derives" });

    const imageIds = new Set(events.map((e) => e.data?.image_id as string).filter(Boolean));
    const imageNode: ProductionGraphNode = {
      id: "image", type: "image",
      connections: ["motion", "timeline"],
      data: { uniqueImages: imageIds.size, totalImages: events.filter((e) => e.data?.image_id).length },
    };
    nodes.push(imageNode);
    edges.push({ from: "concept", to: "image", type: "requires" });

    const motionPaths = new Set(events.map((e) => e.data?.motion_path as string).filter(Boolean));
    const motionNode: ProductionGraphNode = {
      id: "motion", type: "motion",
      connections: ["timeline"],
      data: { motionCount: motionPaths.size },
    };
    nodes.push(motionNode);
    edges.push({ from: "image", to: "motion", type: "applies" });

    const timelineNode: ProductionGraphNode = {
      id: "timeline", type: "timeline",
      connections: ["render"],
      data: { totalEvents: events.length },
    };
    nodes.push(timelineNode);
    edges.push(
      { from: "concept", to: "timeline", type: "informs" },
      { from: "image", to: "timeline", type: "inserts" },
      { from: "motion", to: "timeline", type: "animates" },
    );

    const renderNode: ProductionGraphNode = {
      id: "render", type: "render",
      connections: [],
      data: { status: "pending" },
    };
    nodes.push(renderNode);
    edges.push({ from: "timeline", to: "render", type: "assembles" });

    return { nodes, edges };
  }

  findCriticalPath(graph: ProductionGraph): string[] {
    const adjacency = new Map<string, string[]>();
    for (const node of graph.nodes) {
      adjacency.set(node.id, node.connections);
    }
    const visited = new Set<string>();
    const path: string[] = [];
    const dfs = (id: string): boolean => {
      if (visited.has(id)) return false;
      visited.add(id);
      path.push(id);
      const neighbors = adjacency.get(id) ?? [];
      if (neighbors.length === 0) return true;
      for (const n of neighbors) {
        if (dfs(n)) return true;
      }
      path.pop();
      return false;
    };
    dfs("story");
    return path;
  }
}
