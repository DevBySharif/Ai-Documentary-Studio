export type NodeType =
  | "Project"
  | "Script"
  | "Character"
  | "Location"
  | "Event"
  | "Asset"
  | "ResearchTopic";

export interface GraphNode {
  readonly id: string;
  readonly label: string;
  readonly type: NodeType;
  readonly metadata?: Record<string, unknown>;
}

export interface GraphRelationship {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly relationType: string;
  readonly weight: number;
}

/**
 * Knowledge Graph System (IB Part 19 - Section 17).
 * Models entity relationships across Projects, Scripts, Characters, Locations, Assets, and Topics.
 */
export class KnowledgeGraph {
  private nodes = new Map<string, GraphNode>();
  private relationships: GraphRelationship[] = [];

  public addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
  }

  public addRelationship(rel: GraphRelationship): void {
    this.relationships.push(rel);
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public getRelatedNodes(nodeId: string): ReadonlyArray<GraphNode> {
    const connectedIds = this.relationships
      .filter((r) => r.sourceId === nodeId || r.targetId === nodeId)
      .map((r) => (r.sourceId === nodeId ? r.targetId : r.sourceId));

    return connectedIds
      .map((id) => this.nodes.get(id))
      .filter((n): n is GraphNode => n !== undefined);
  }
}
