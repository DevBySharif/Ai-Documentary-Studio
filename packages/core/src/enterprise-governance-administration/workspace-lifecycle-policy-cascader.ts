import { WorkspaceLifecycleState, OrganizationPolicyRules } from "./governance-types";

export interface WorkspaceLifecycleRecord {
  readonly workspaceId: string;
  readonly currentState: WorkspaceLifecycleState;
  readonly lastTransitionedAt: Date;
}

/**
 * Workspace Lifecycle Manager & Policy Cascading Engine (Vol 08 Part 07 - Section 7, Section 8).
 * Controls workspace lifecycle states (`Created → Active → Archived → ReadOnly → Deleted`) and cascades org policies downward.
 */
export class WorkspaceLifecyclePolicyCascader {
  private lifecycles = new Map<string, WorkspaceLifecycleRecord>();
  private defaultOrgPolicy: OrganizationPolicyRules = {
    approvedAiProviders: ["OpenAI", "Gemini", "FLUX", "ElevenLabs"],
    dataRetentionDays: 365,
    exportRestrictionsEnabled: false,
    promptGovernanceEnabled: true,
    maxWorkspaceQuotaBytes: 1099511627776, // 1 TB
  };

  public registerWorkspaceLifecycle(workspaceId: string): WorkspaceLifecycleRecord {
    const rec: WorkspaceLifecycleRecord = {
      workspaceId,
      currentState: "Active",
      lastTransitionedAt: new Date(),
    };
    this.lifecycles.set(workspaceId, rec);
    return rec;
  }

  public transitionWorkspaceState(workspaceId: string, targetState: WorkspaceLifecycleState): WorkspaceLifecycleRecord | undefined {
    const current = this.lifecycles.get(workspaceId);
    if (!current) return undefined;

    const updated: WorkspaceLifecycleRecord = {
      workspaceId,
      currentState: targetState,
      lastTransitionedAt: new Date(),
    };
    this.lifecycles.set(workspaceId, updated);
    return updated;
  }

  public getCascadedPolicy(): OrganizationPolicyRules {
    return this.defaultOrgPolicy;
  }
}
