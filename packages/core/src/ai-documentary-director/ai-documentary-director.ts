import { AutonomousMode, ProductionPhase, ProductionPlan } from "./director-types";
import { AgentDelegator } from "./agent-delegator";
import { QualityGateManager } from "./quality-gate-manager";
import { RevisionLoopController } from "./revision-loop-controller";
import { ProductionMemory } from "./production-memory";
import { ResourceOptimizer } from "./resource-optimizer";

export interface DirectorDecisionReport {
  readonly decision: string;
  readonly reason: string;
  readonly confidence: number;
  readonly expectedImpact: string;
}

/**
 * Master AI Documentary Director Engine (Main Vol 04 Part 10).
 * Orchestrates the full production pipeline: Topic -> Planning -> Research -> Writing -> Storyboard -> Assets -> Narration -> Timeline -> Review -> Approval -> Final Production.
 */
export class AiDocumentaryDirector {
  public readonly delegator = new AgentDelegator();
  public readonly qualityGates = new QualityGateManager();
  public readonly revisionController = new RevisionLoopController();
  public readonly memory = new ProductionMemory();
  public readonly resourceOptimizer = new ResourceOptimizer();

  public async initializeProduction(
    topic: string,
    mode: AutonomousMode = "GuidedMode"
  ): Promise<{ plan: ProductionPlan; decisionReport: DirectorDecisionReport }> {
    this.memory.addProjectGoal(`Produce professional documentary on: ${topic}`);

    const tasks = this.delegator.delegatePhaseTasks("Research");
    const resourcePlan = this.resourceOptimizer.planResourceOptimization(15);

    const plan: ProductionPlan = {
      planId: `prod_plan_${Math.random().toString(36).substring(2, 9)}`,
      topic,
      mode,
      currentPhase: "Research",
      tasks,
      estimatedDurationMins: resourcePlan.estimatedTimeMinutes,
    };

    const decisionReport: DirectorDecisionReport = {
      decision: "Initiate Production Phase: Research",
      reason: "Structured research foundation required before narrative drafting.",
      confidence: 0.98,
      expectedImpact: `Establishes verified historical facts in ~${resourcePlan.estimatedTimeMinutes} mins`,
    };

    return { plan, decisionReport };
  }
}
