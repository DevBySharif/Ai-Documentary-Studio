import type { HoldOptimization } from "./types.js";
import type { MasterTimeline, TimelineBlock } from "../timeline/types.js";

export class HoldOptimizer {
  optimize(blocks: TimelineBlock[]): HoldOptimization[] {
    const results: HoldOptimization[] = [];

    for (const block of blocks) {
      const currentDuration = block.end - block.start;
      const viewerProcessingTime = this.estimateProcessingTime(block);

      const minDuration = block.priority === "critical" ? 5 :
        block.priority === "high" ? 3.5 :
        block.priority === "medium" ? 2.5 : 1.5;

      const recommendedDuration = Math.max(currentDuration, minDuration, viewerProcessingTime);
      const adjusted = recommendedDuration > currentDuration + 0.5;

      if (adjusted) {
        results.push({
          segment: parseInt(block.id.replace(/\D/g, "")) || 0,
          currentDuration,
          recommendedDuration: Math.round(recommendedDuration * 10) / 10,
          viewerProcessingTime: Math.round(viewerProcessingTime * 10) / 10,
          adjusted,
        });
      }
    }

    return results;
  }

  private estimateProcessingTime(block: TimelineBlock): number {
    let baseTime = 2;
    const wordCount = block.subtitle ? block.subtitle.split(/\s+/).length : 10;
    baseTime += wordCount * 0.15;
    if (block.priority === "critical" || block.priority === "high") baseTime += 2;
    if (block.motion !== "hold") baseTime += 0.5;
    if (block.wordInsert) baseTime += 1.5;
    return baseTime;
  }
}
