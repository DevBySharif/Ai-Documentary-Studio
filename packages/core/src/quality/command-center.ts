import type { ProductionCommandCenter, AutoRepairAction, QualityGate, QualityScorecard } from "./types.js";

export class ProductionCommandCenterDashboard {
  build(
    scorecard: QualityScorecard,
    repairs: AutoRepairAction[],
    gates: QualityGate[],
    estimatedRenderTime: number,
    reusePercentage: number,
    retentionScore: number
  ): ProductionCommandCenter {
    return {
      storyScore: scorecard.story.score,
      promptScore: scorecard.prompt.score,
      imageScore: scorecard.image.score,
      audioScore: scorecard.audio.score,
      motionScore: scorecard.motion.score,
      syncScore: scorecard.synchronization.score,
      renderReadiness: scorecard.status,
      autoRepairSuggestions: repairs,
      estimatedRenderTime,
      estimatedImageReusePercentage: reusePercentage,
      estimatedViewerRetentionScore: retentionScore,
      gates,
      report: scorecard,
    };
  }

  getSummary(center: ProductionCommandCenter): string {
    const parts: string[] = [];
    parts.push(`Readiness: ${center.renderReadiness}`);
    parts.push(`Story: ${center.storyScore} | Prompt: ${center.promptScore} | Image: ${center.imageScore}`);
    parts.push(`Audio: ${center.audioScore} | Motion: ${center.motionScore} | Sync: ${center.syncScore}`);
    parts.push(`Estimated retention: ${center.estimatedViewerRetentionScore}%`);
    parts.push(`Image reuse: ${center.estimatedImageReusePercentage}%`);
    parts.push(`Estimated render time: ${center.estimatedRenderTime}s`);

    const openGates = center.gates.filter((g) => !g.passed);
    if (openGates.length > 0) {
      parts.push(`Open gates: ${openGates.map((g) => g.name).join(", ")}`);
    }

    const pendingRepairs = center.autoRepairSuggestions.filter((r) => !r.automatic);
    if (pendingRepairs.length > 0) {
      parts.push(`Manual repairs needed: ${pendingRepairs.length}`);
    }

    return parts.join("\n");
  }
}
