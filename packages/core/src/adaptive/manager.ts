import type { OptimizationReport, TimelineCandidate, TimelineScores } from "./types.js";
import type { MasterTimeline } from "../timeline/types.js";
import { MultiPassOptimizer } from "./multi-pass.js";
import { HoldOptimizer } from "./hold-optimizer.js";
import { TimelineCandidateScorer } from "./candidate-scorer.js";
import { ProductionOptimizationAI } from "./production-optimization-ai.js";
import { TimelineSimulator } from "./simulator.js";

export class AdaptiveTimelineAI {
  private multiPass: MultiPassOptimizer;
  private holdOptimizer: HoldOptimizer;
  private candidateScorer: TimelineCandidateScorer;
  private productionAI: ProductionOptimizationAI;
  private simulator: TimelineSimulator;

  constructor() {
    this.multiPass = new MultiPassOptimizer();
    this.holdOptimizer = new HoldOptimizer();
    this.candidateScorer = new TimelineCandidateScorer();
    this.productionAI = new ProductionOptimizationAI();
    this.simulator = new TimelineSimulator();
  }

  async optimize(timeline: MasterTimeline): Promise<{
    optimizedTimeline: MasterTimeline;
    report: OptimizationReport;
    candidates: TimelineCandidate[];
    productionOptimizations: ReturnType<typeof ProductionOptimizationAI.prototype.analyze>;
    simulation: ReturnType<typeof TimelineSimulator.prototype.simulate>;
  }> {
    const originalScore = this.candidateScorer.score(timeline);

    const candidates: TimelineCandidate[] = [];

    const candidateA = { ...timeline };
    const aScores = this.candidateScorer.score(candidateA);
    candidates.push({ id: "A", timeline: candidateA, scores: aScores, totalScore: aScores.overall });

    const candidateB: MasterTimeline = {
      ...timeline,
      blocks: timeline.blocks.map((b) => ({
        ...b,
        hold: b.end - b.start > 5 ? b : b,
        motion: b.priority === "critical" && b.motion === "hold" ? "slow_push_in" : b.motion,
      })),
    };
    const bScores = this.candidateScorer.score(candidateB);
    candidates.push({ id: "B", timeline: candidateB, scores: bScores, totalScore: bScores.overall });

    const candidateC: MasterTimeline = {
      ...timeline,
      blocks: timeline.blocks.map((b) => ({
        ...b,
        transition: b.transition === "cut" && b.priority === "high" ? "cross_fade" : b.transition,
      })),
    };
    const cScores = this.candidateScorer.score(candidateC);
    candidates.push({ id: "C", timeline: candidateC, scores: cScores, totalScore: cScores.overall });

    const candidateD: MasterTimeline = {
      ...timeline,
      blocks: timeline.blocks
        .filter((b, i) => {
          if (i === 0) return true;
          if (b.concept === timeline.blocks[i - 1].concept && b.emotion === timeline.blocks[i - 1].emotion) {
            return Math.random() > 0.5;
          }
          return true;
        }),
    };
    const dScores = this.candidateScorer.score(candidateD);
    candidates.push({ id: "D", timeline: candidateD, scores: dScores, totalScore: dScores.overall });

    const best = this.candidateScorer.selectBest(candidates);

    const { results } = await this.multiPass.optimize(best.timeline);
    const holdOptimizations = this.holdOptimizer.optimize(best.timeline.blocks);
    const productionOptimizations = this.productionAI.analyze(best.timeline);
    const simulation = this.simulator.simulate(best.timeline.blocks.length, best.timeline.totalDuration);

    const finalScore = best.totalScore;
    const improvements: string[] = [];
    if (finalScore > originalScore.overall) {
      improvements.push(`Score improved from ${originalScore.overall} to ${finalScore}`);
    }

    for (const pass of results) {
      improvements.push(...pass.improvements);
    }

    if (holdOptimizations.length > 0) {
      improvements.push(`${holdOptimizations.length} holds optimized`);
    }

    return {
      optimizedTimeline: best.timeline,
      report: {
        originalScore: originalScore.overall,
        finalScore,
        passes: results,
        improvements,
        autoRepairs: holdOptimizations.filter((h) => h.adjusted).length,
        totalChanges: holdOptimizations.length,
      },
      candidates,
      productionOptimizations,
      simulation,
    };
  }
}
