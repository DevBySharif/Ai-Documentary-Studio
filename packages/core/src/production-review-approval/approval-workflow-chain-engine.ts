import { ReviewStatusState, ApprovalStageType, ReviewAssignmentDescriptor } from "./review-types";

/**
 * Multi-Stage Approval Workflow Chain Engine (Vol 08 Part 04 - Section 8, Section 9, Section 10).
 * Drives multi-stage approvals (`Research → Script → Storyboard → Narration → Export`) through approval chains (`Author → Reviewer → Lead → Producer → Approved`).
 */
export class ApprovalWorkflowChainEngine {
  private assignments: ReviewAssignmentDescriptor[] = [];

  public createReviewAssignment(
    targetId: string,
    stage: ApprovalStageType,
    assignedToId: string,
    assignedToType: ReviewAssignmentDescriptor["assignedToType"] = "User"
  ): ReviewAssignmentDescriptor {
    const assignment: ReviewAssignmentDescriptor = {
      assignmentId: `asg_rev_${Math.random().toString(36).substring(2, 7)}`,
      targetId,
      stage,
      assignedToId,
      assignedToType,
      status: "InReview",
    };

    this.assignments.push(assignment);
    return assignment;
  }

  public updateReviewStatus(assignmentId: string, targetStatus: ReviewStatusState): ReviewAssignmentDescriptor | undefined {
    const idx = this.assignments.findIndex((a) => a.assignmentId === assignmentId);
    if (idx === -1) return undefined;

    const updated: ReviewAssignmentDescriptor = {
      ...this.assignments[idx],
      status: targetStatus,
    };
    this.assignments[idx] = updated;
    return updated;
  }
}
