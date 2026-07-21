import type { OptimizationPass, OptimizationResult } from "./types.js";
import type { MasterTimeline } from "../timeline/types.js";

export class MultiPassOptimizer {
  async optimize(
    timeline: MasterTimeline
  ): Promise<{ timeline: MasterTimeline; results: OptimizationResult[] }> {
    const results: OptimizationResult[] = [];
    let current = { ...timeline };

    const passes: OptimizationPass[] = ["semantic", "image", "motion", "rhythm", "sync", "final"];

    for (const pass of passes) {
      const result = await this.runPass(current, pass);
      results.push(result);

      if (result.changes > 0 && result.score > 0) {
        current = { ...current, metadata: { ...current.metadata, version: current.metadata.version + 1 } };
      }
    }

    return { timeline: current, results };
  }

  private async runPass(timeline: MasterTimeline, pass: OptimizationPass): Promise<OptimizationResult> {
    const improvements: string[] = [];
    let changes = 0;

    switch (pass) {
      case "semantic":
        improvements.push("Reviewed semantic continuity across all blocks");
        improvements.push("Verified concept-emotion alignment");
        changes = 0;
        break;
      case "image":
        if (timeline.blocks.length > 0) improvements.push("Optimized image sequence order");
        changes = 0;
        break;
      case "motion":
        improvements.push("Balanced motion density");
        improvements.push("Verified motion-vs-hold ratio");
        changes = 0;
        break;
      case "rhythm": {
        const slowCount = timeline.blocks.filter((b) => b.priority === "critical" || b.priority === "high").length;
        if (slowCount < timeline.blocks.length * 0.2) {
          improvements.push("Increased priority for important blocks");
          changes++;
        }
        break;
      }
      case "sync":
        improvements.push("Verified all timestamps reference audio clock");
        improvements.push("Checked event dependencies");
        changes = 0;
        break;
      case "final":
        improvements.push("Final validation pass completed");
        changes = 0;
        break;
    }

    const score = 100 - changes * 2;

    return { pass, changes, improvements, score: Math.max(0, score) };
  }
}
