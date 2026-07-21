import { SupervisorTaskState } from "./supervisor-types";

/**
 * Dependency & Approval Enforcer (Vol 07 Part 04 - Section 7, Section 8).
 * Enforces task prerequisites and pauses workflow for human approvals (Outline, Script, Storyboard, Thumbnail).
 */
export class DependencyApprovalEnforcer {
  public canTaskStart(
    task: SupervisorTaskState,
    prereqTaskIds: ReadonlyArray<string>,
    allTasks: Map<string, SupervisorTaskState>
  ): boolean {
    const prereqsCompleted = prereqTaskIds.every((id) => {
      const t = allTasks.get(id);
      return t && t.status === "Completed";
    });

    return prereqsCompleted && task.status === "Pending";
  }

  public grantApproval(task: SupervisorTaskState): SupervisorTaskState {
    return {
      ...task,
      isApproved: true,
      status: "Ready",
    };
  }
}
