import type { DNAPerformanceMetrics } from "./types.js";

export class DNAPerformanceAnalyzer {
  record(qaPass: number, regenRate: number, renderTime: number, promptSuccess: number, subtitleCorrect: number, duration: number): DNAPerformanceMetrics {
    return {
      qaPassRate: qaPass, imageRegenerationRate: regenRate,
      avgRenderTime: renderTime, promptSuccessRate: promptSuccess,
      subtitleCorrectionRate: subtitleCorrect, productionDuration: duration
    };
  }

  recommendImprovements(metrics: DNAPerformanceMetrics): string[] {
    const recs: string[] = [];
    if (metrics.qaPassRate < 80) recs.push("Review QA rules — pass rate below 80%");
    if (metrics.imageRegenerationRate > 20) recs.push("Image regeneration rate high — review prompt rules");
    if (metrics.promptSuccessRate < 70) recs.push("Prompt success rate low — refine prompt templates");
    return recs;
  }
}
