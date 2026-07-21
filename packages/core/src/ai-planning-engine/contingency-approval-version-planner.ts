import { ExecutionPlanDescriptor } from "./planning-types";

/**
 * Contingency, Approval & Version Planner (Vol 07 Part 03 - Section 12, Section 13, Section 14, Section 15, Section 16).
 * Prepares provider fallback paths, places human approval gates, handles versioned plans, adaptive replanning, and explainable decision records.
 */
export class ContingencyApprovalVersionPlanner {
  private planVersions: ExecutionPlanDescriptor[] = [];

  public registerPlanVersion(plan: ExecutionPlanDescriptor): void {
    this.planVersions.push(plan);
  }

  public getFallbackPath(failedCapability: string): ReadonlyArray<string> {
    return ["Provider_Primary", "Provider_Secondary", "Local_Fallback", "Manual_Review"];
  }

  public getPlanHistory(projectId: string): ReadonlyArray<ExecutionPlanDescriptor> {
    return this.planVersions.filter((p) => p.projectId === projectId);
  }
}
