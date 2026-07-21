import { IntelligenceModeManager } from "./intelligence-levels";
import { CapabilityDomainRegistry } from "./capability-domains";
import { VirtualProductionTeam } from "./virtual-production-team";
import { ProductionWorkflowPipeline } from "./production-workflow-pipeline";
import { FeatureFamilyRegistry } from "./feature-family-registry";
import { createExplainableDecision, AiDecisionRecommendation } from "./explainable-decision-model";

/**
 * Master Production Ecosystem Engine (Main Vol 04 Part 01).
 * Single entry point orchestrating intelligence levels, capability domains, explainable decisions,
 * human-first approvals, virtual team members, and feature families.
 */
export class MasterProductionEcosystemEngine {
  public readonly modeManager = new IntelligenceModeManager();
  public readonly capabilityDomains = new CapabilityDomainRegistry();
  public readonly virtualTeam = new VirtualProductionTeam();
  public readonly workflowPipeline = new ProductionWorkflowPipeline();
  public readonly featureFamilies = new FeatureFamilyRegistry();

  public createRecommendation(
    actionType: string,
    recommendation: string,
    reason: string,
    confidence: number,
    expectedImpact: string
  ): AiDecisionRecommendation {
    return createExplainableDecision(actionType, recommendation, reason, confidence, expectedImpact);
  }
}
