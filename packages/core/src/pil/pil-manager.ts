import type { PILReport } from "./types.js";
import type { StoryScript } from "../story/types.js";
import type { PromptPlan } from "../prompt/types.js";
import type { MotionTimeline } from "../editor/types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";
import type { CategoryScore } from "../quality/types.js";

import { StoryOptimizer } from "./story-optimizer.js";
import { VisualOptimizer } from "./visual-optimizer.js";
import { SyncOptimizer } from "./sync-optimizer.js";
import { MotionOptimizer } from "./motion-optimizer.js";
import { QualityPredictor } from "./quality-predictor.js";
import { RenderOptimizer } from "./render-optimizer.js";

export class ProductionIntelligenceLayer {
  private story: StoryOptimizer;
  private visual: VisualOptimizer;
  private sync: SyncOptimizer;
  private motion: MotionOptimizer;
  private quality: QualityPredictor;
  private render: RenderOptimizer;

  constructor() {
    this.story = new StoryOptimizer();
    this.visual = new VisualOptimizer();
    this.sync = new SyncOptimizer();
    this.motion = new MotionOptimizer();
    this.quality = new QualityPredictor();
    this.render = new RenderOptimizer();
  }

  analyze(
    script: StoryScript,
    promptPlan: PromptPlan,
    audio: AudioIntelligenceResult,
    motionTimeline: MotionTimeline,
    qualityScores: Record<string, CategoryScore>
  ): PILReport {
    const storyResult = this.story.analyze(script);
    const visualResult = this.visual.analyze(promptPlan);
    const syncResult = this.sync.analyze(audio, motionTimeline);
    const motionResult = this.motion.analyze(motionTimeline);
    const qualityResult = this.quality.predict(qualityScores);
    const renderResult = this.render.analyze(script, promptPlan);

    const allPredictions = [
      ...storyResult.predictions,
      ...visualResult.predictions,
      ...syncResult.predictions,
      ...motionResult.predictions,
      ...qualityResult.predictions,
      ...renderResult.predictions,
    ];

    const allOptimizations = [
      ...storyResult.optimizations,
      ...visualResult.optimizations,
      ...syncResult.optimizations,
      ...motionResult.optimizations,
      ...qualityResult.optimizations,
      ...renderResult.optimizations,
    ];

    const highRisk = allPredictions.filter((p) => p.risk >= 70).length;
    const totalPredictions = allPredictions.length;
    const overallReadiness = totalPredictions > 0
      ? Math.round((1 - highRisk / totalPredictions) * 100)
      : 95;

    const totalGain = allOptimizations.reduce((sum, o) => sum + o.expectedGain, 0);
    const estimatedImprovement = allOptimizations.length > 0
      ? Math.min(Math.round(totalGain / allOptimizations.length), 100)
      : 0;

    return {
      predictions: allPredictions,
      optimizations: allOptimizations,
      overallReadiness,
      estimatedImprovement,
      summary: this.buildSummary(allPredictions, allOptimizations, overallReadiness),
    };
  }

  private buildSummary(
    predictions: { category: string; risk: number }[],
    optimizations: { target: string; expectedGain: number }[],
    readiness: number
  ): string {
    const highRisk = predictions.filter((p) => p.risk >= 70).length;
    const parts: string[] = [];
    parts.push(`Production Readiness: ${readiness}%`);
    if (highRisk > 0) parts.push(`High-risk issues: ${highRisk}`);
    if (optimizations.length > 0) {
      const avgGain = Math.round(optimizations.reduce((s, o) => s + o.expectedGain, 0) / optimizations.length);
      parts.push(`Optimizations available: ${optimizations.length} (avg gain: ${avgGain}%)`);
    }
    return parts.join(" | ");
  }
}
