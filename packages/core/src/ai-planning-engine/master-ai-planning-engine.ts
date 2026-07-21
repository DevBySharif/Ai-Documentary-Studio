import { GoalAnalyzerDecomposer } from "./goal-analyzer-decomposer";
import { DependencyGraphParallelPlanner } from "./dependency-graph-parallel-planner";
import { ResourceEstimatorOptimizer } from "./resource-estimator-optimizer";
import { ContingencyApprovalVersionPlanner } from "./contingency-approval-version-planner";
import { ExecutionPlanDescriptor, ExecutionStrategyType } from "./planning-types";

/**
 * Master AI Planning Engine (Main Vol 07 Part 03).
 * Core entry point for transforming high-level goals into structured, executable production plans.
 */
export class MasterAiPlanningEngine {
  public readonly decomposer = new GoalAnalyzerDecomposer();
  public readonly parallelPlanner = new DependencyGraphParallelPlanner();
  public readonly estimatorOptimizer = new ResourceEstimatorOptimizer();
  public readonly versionPlanner = new ContingencyApprovalVersionPlanner();

  public generateExecutionPlan(
    projectId: string,
    primaryGoal: string,
    strategy: ExecutionStrategyType = "Hybrid"
  ): ExecutionPlanDescriptor {
    const rawTasks = this.decomposer.decomposeIntoAtomicTasks(primaryGoal);
    const { optimizedTasks } = this.estimatorOptimizer.optimizePlan(rawTasks);
    const estimates = this.estimatorOptimizer.estimatePlanResources(optimizedTasks);

    const plan: ExecutionPlanDescriptor = {
      planId: `plan_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      planVersion: 1,
      primaryGoal,
      strategy,
      tasks: optimizedTasks,
      estimates,
      decisionRationale: [
        `Decomposed goal into ${optimizedTasks.length} atomic production tasks.`,
        `Selected ${strategy} strategy to optimize parallel media generation.`,
        `Placed human approval gates on Script, Storyboard, Images, Voice, and Review.`,
      ],
      createdAt: new Date(),
      status: "Approved",
    };

    this.versionPlanner.registerPlanVersion(plan);
    return plan;
  }
}
