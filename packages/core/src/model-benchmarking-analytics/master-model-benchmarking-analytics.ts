import { PerformanceCollectorDatabase } from "./performance-collector-database";
import { ModelScorecardRankingEngine } from "./model-scorecard-ranking-engine";
import { AbTestingRegressionDetector } from "./ab-testing-regression-detector";
import { AdaptiveModelRoutingSelector } from "./adaptive-model-routing-selector";
import { ModelProfileType } from "./benchmarking-types";

/**
 * Master Model Benchmarking Analytics Engine (Main Vol 07 Part 09).
 * Core entry point for 6-stage benchmarking pipeline (`Execution → Performance Collection → Quality Analysis → Benchmark DB → Ranking → Routing Recommendation`).
 */
export class MasterModelBenchmarkingAnalytics {
  public readonly database = new PerformanceCollectorDatabase();
  public readonly rankingEngine = new ModelScorecardRankingEngine();
  public readonly abRegressionDetector = new AbTestingRegressionDetector();
  public readonly adaptiveSelector = new AdaptiveModelRoutingSelector();

  public recommendModelForWorkflow(
    capability: string,
    candidateModelIds: string[],
    preferredProfile: ModelProfileType = "HighestQuality"
  ): ReturnType<AdaptiveModelRoutingSelector["selectOptimalModel"]> {
    return this.adaptiveSelector.selectOptimalModel(
      capability,
      candidateModelIds,
      preferredProfile,
      this.rankingEngine
    );
  }
}
