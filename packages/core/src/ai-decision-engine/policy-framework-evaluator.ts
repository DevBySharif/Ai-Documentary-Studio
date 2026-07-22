import { DecisionPolicyConfig, PolicyPriorityType } from "./decision-types";

/**
 * Policy Framework & Priority Evaluator (Vol 07 Part 08 - Section 5, Section 14).
 * Configures application/project policies and enforces the priority hierarchy (`Safety → Correctness → Quality → Reliability → UserPolicy → Cost → Speed`).
 */
export class PolicyFrameworkEvaluator {
  private defaultPolicy: DecisionPolicyConfig = {
    preferQualityOverSpeed: true,
    preferLowestCost: false,
    preferLocalModels: false,
    requireHumanApprovalForFacts: true,
    allowExperimentalModels: false,
  };

  private priorityHierarchy: PolicyPriorityType[] = [
    "Safety",
    "Correctness",
    "Quality",
    "Reliability",
    "UserPolicy",
    "Cost",
    "Speed",
  ];

  public getActivePolicy(): DecisionPolicyConfig {
    return this.defaultPolicy;
  }

  public getPriorityHierarchy(): ReadonlyArray<PolicyPriorityType> {
    return this.priorityHierarchy;
  }
}
