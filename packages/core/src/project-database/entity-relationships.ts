import { PDEntityType } from "./types";

interface RelationshipEdge {
  parentType: PDEntityType;
  parentId: string;
  childType: PDEntityType;
  childId: string;
}

const VALID_HIERARCHY: Record<PDEntityType, PDEntityType[]> = {
  workspace: ["project"],
  project: ["channel", "script", "prompt", "scene", "asset", "timeline", "export", "qa_report"],
  channel: ["channel_dna"],
  channel_dna: [],
  script: ["scene", "prompt"],
  prompt: [],
  scene: ["image", "audio", "motion", "effect", "subtitle"],
  image: [],
  audio: [],
  timeline: ["motion", "effect", "subtitle"],
  motion: [],
  effect: [],
  subtitle: [],
  qa_report: [],
  export: [],
  asset: [],
  user: ["workspace", "project"],
  plugin: [],
  setting: [],
};

export class PDEntityRelationships {
  private edges = new Map<string, RelationshipEdge[]>();

  addRelationship(
    parentType: PDEntityType,
    parentId: string,
    childType: PDEntityType,
    childId: string
  ): void {
    if (!this.edges.has(parentId)) {
      this.edges.set(parentId, []);
    }
    this.edges.get(parentId)!.push({ parentType, parentId, childType, childId });
  }

  getChildren(parentId: string): { type: PDEntityType; id: string }[] {
    const edges = this.edges.get(parentId) || [];
    return edges.map((e) => ({ type: e.childType, id: e.childId }));
  }

  getParent(childId: string): { type: PDEntityType; id: string } | undefined {
    for (const [, edges] of this.edges) {
      const found = edges.find((e) => e.childId === childId);
      if (found) {
        return { type: found.parentType, id: found.parentId };
      }
    }
    return undefined;
  }

  validateRelationship(parentId: string, childId: string): boolean {
    const edges = this.edges.get(parentId);
    if (!edges) return false;
    return edges.some((e) => e.childId === childId);
  }

  getRelationshipPath(childId: string): string[] {
    const path: string[] = [];
    let currentId: string | undefined = childId;
    while (currentId) {
      path.unshift(currentId);
      const parent = this.getParent(currentId);
      currentId = parent?.id;
    }
    return path;
  }
}
