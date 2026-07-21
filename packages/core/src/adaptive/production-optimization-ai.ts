import type { ProductionOptimization } from "./types.js";
import type { MasterTimeline } from "../timeline/types.js";

export class ProductionOptimizationAI {
  analyze(timeline: MasterTimeline): ProductionOptimization[] {
    const optimizations: ProductionOptimization[] = [];

    const criticalCount = timeline.blocks.filter((b) => b.priority === "critical").length;
    if (criticalCount < timeline.blocks.length * 0.1 && timeline.blocks.length > 5) {
      optimizations.push({
        target: "timeline",
        issue: "Too few critical-priority blocks — story peaks may feel flat",
        recommendation: "Increase priority for reveal and key explanation segments",
        expectedImprovement: 15,
        crossEngine: false,
      });
    }

    const holds = timeline.blocks.filter((b) => b.motion === "hold").length;
    if (holds > timeline.blocks.length * 0.85) {
      optimizations.push({
        target: "motion",
        issue: "Excessive holds — timeline may feel static",
        recommendation: "Convert 20% of holds to gentle push-ins or pans",
        expectedImprovement: 20,
        crossEngine: true,
      });
    }

    const allSameTransition = timeline.blocks.every((b) => b.transition === "cut");
    if (allSameTransition && timeline.blocks.length > 3) {
      optimizations.push({
        target: "transitions",
        issue: "All transitions are cuts — no visual variety",
        recommendation: "Use cross-fade for scene changes, fade for emotional moments",
        expectedImprovement: 10,
        crossEngine: false,
      });
    }

    const transitions = timeline.blocks.filter((b) => b.transition !== "cut").length;
    if (transitions > timeline.blocks.length * 0.5) {
      optimizations.push({
        target: "transitions",
        issue: "Too many transitions — may distract viewer",
        recommendation: "Reduce transitions to key moments only",
        expectedImprovement: 12,
        crossEngine: false,
      });
    }

    return optimizations;
  }
}
