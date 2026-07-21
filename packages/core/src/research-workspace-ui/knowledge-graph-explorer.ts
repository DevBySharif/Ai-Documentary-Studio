import { EntityDescriptor, KnowledgeGraphNode } from "./research-ui-types";

/**
 * Knowledge Graph & Entity Explorer (Vol 05 Part 04 - Section 8, Section 9).
 * Visualizes non-linear relationships between People, Organizations, Places, Events, and Documents.
 */
export class KnowledgeGraphExplorer {
  private entities: EntityDescriptor[] = [
    {
      entityId: "ent_1",
      name: "Isambard Kingdom Brunel",
      category: "Person",
      description: "English mechanical and civil engineer during the Industrial Revolution.",
      confidenceScore: 99,
      relatedSourceIds: ["src_1"],
    },
    {
      entityId: "ent_2",
      name: "Great Western Railway",
      category: "Organization",
      description: "British railway company linking London with southwest and west of England.",
      confidenceScore: 98,
      relatedSourceIds: ["src_1", "src_2"],
    },
  ];

  public getKnowledgeGraphNodes(): ReadonlyArray<KnowledgeGraphNode> {
    return this.entities.map((e) => ({
      nodeId: e.entityId,
      label: e.name,
      type: e.category,
      connectedNodeIds: this.entities.filter((other) => other.entityId !== e.entityId).map((o) => o.entityId),
    }));
  }

  public getEntities(): ReadonlyArray<EntityDescriptor> {
    return this.entities;
  }
}
