import type { TimelineCandidate, TimelineScores } from "./types.js";
import type { MasterTimeline } from "../timeline/types.js";

export class TimelineCandidateScorer {
  score(timeline: MasterTimeline): TimelineScores {
    const blocks = timeline.blocks;

    const storyFlow = this.scoreStoryFlow(blocks);
    const visualFlow = this.scoreVisualFlow(blocks);
    const synchronization = this.scoreSync(blocks);
    const motion = this.scoreMotion(blocks);
    const retention = this.scoreRetention(blocks);
    const viewerComfort = this.scoreComfort(blocks);
    const semanticContinuity = this.scoreSemanticContinuity(blocks);

    const overall = Math.round(
      storyFlow * 0.15 + visualFlow * 0.15 + synchronization * 0.15 +
      motion * 0.15 + retention * 0.15 + viewerComfort * 0.1 + semanticContinuity * 0.15
    );

    return {
      storyFlow, visualFlow, synchronization, motion,
      retention, viewerComfort, semanticContinuity, overall,
    };
  }

  selectBest(candidates: TimelineCandidate[]): TimelineCandidate {
    return candidates.sort((a, b) => b.totalScore - a.totalScore)[0];
  }

  private scoreStoryFlow(blocks: MasterTimeline["blocks"]): number {
    return blocks.length >= 3 ? 85 : 60;
  }

  private scoreVisualFlow(blocks: MasterTimeline["blocks"]): number {
    const imageChanges = blocks.filter((b) => b.imageType === "master_scene").length;
    const ratio = blocks.length > 0 ? imageChanges / blocks.length : 0;
    return Math.round(Math.max(0, 100 - ratio * 50));
  }

  private scoreSync(_blocks: MasterTimeline["blocks"]): number {
    return 85;
  }

  private scoreMotion(blocks: MasterTimeline["blocks"]): number {
    const holds = blocks.filter((b) => b.motion === "hold").length;
    const ratio = blocks.length > 0 ? holds / blocks.length : 0;
    if (ratio > 0.8) return 70;
    if (ratio > 0.5) return 85;
    return 75;
  }

  private scoreRetention(blocks: MasterTimeline["blocks"]): number {
    const highPriority = blocks.filter((b) => b.priority === "critical" || b.priority === "high").length;
    return Math.round(Math.min(100, 60 + highPriority * 5));
  }

  private scoreComfort(_blocks: MasterTimeline["blocks"]): number {
    return 80;
  }

  private scoreSemanticContinuity(blocks: MasterTimeline["blocks"]): number {
    const conceptChanges = blocks.filter((b, i) => i > 0 && b.concept !== blocks[i - 1].concept).length;
    const ratio = blocks.length > 0 ? conceptChanges / blocks.length : 0;
    return Math.round(Math.max(0, 100 - ratio * 40));
  }
}
