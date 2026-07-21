import type { PDEngineType } from "./types.js";

export class PDIntelligentRegenerationGraph {
  private readonly dependencies: Record<PDEngineType, PDEngineType[]> = {
    script: ["prompt"],
    prompt: ["image_approval"],
    image_approval: ["motion"],
    voice: ["timeline"],
    timeline: ["motion", "subtitle", "effects"],
    motion: ["effects"],
    subtitle: [],
    effects: ["qa"],
    qa: ["export"],
    export: []
  };

  getDependents(engine: PDEngineType): PDEngineType[] {
    return this.dependencies[engine] ?? [];
  }

  getAffectedByChange(engine: PDEngineType): PDEngineType[] {
    const affected: Set<PDEngineType> = new Set();
    const queue = [engine];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const deps = this.getDependents(current);
      for (const dep of deps) {
        if (!affected.has(dep)) {
          affected.add(dep);
          queue.push(dep);
        }
      }
    }

    return Array.from(affected);
  }
}
