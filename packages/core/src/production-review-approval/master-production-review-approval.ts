import { AnnotationDiscussionThreadManager } from "./annotation-discussion-thread-manager";
import { ApprovalWorkflowChainEngine } from "./approval-workflow-chain-engine";
import { AiAssistedReviewAdvisor } from "./ai-assisted-review-advisor";
import { ImmutableDecisionNotificationVault } from "./immutable-decision-notification-vault";
import { ReviewTargetType, ApprovalStageType } from "./review-types";

/**
 * Master Production Review Approval Engine (Main Vol 08 Part 04).
 * Core entry point for 6-layer review architecture (`Project → Asset → Annotation → Discussion → Decision → Approval`).
 */
export class MasterProductionReviewApproval {
  public readonly threadManager = new AnnotationDiscussionThreadManager();
  public readonly workflowChain = new ApprovalWorkflowChainEngine();
  public readonly aiAdvisor = new AiAssistedReviewAdvisor();
  public readonly decisionVault = new ImmutableDecisionNotificationVault();

  public initAssetReviewWorkflow(
    targetId: string,
    targetType: ReviewTargetType,
    contextAnchor: string,
    authorUserId: string,
    commentText: string,
    stage: ApprovalStageType = "ScriptApproval"
  ): {
    annotation: ReturnType<AnnotationDiscussionThreadManager["createAnnotation"]>;
    assignment: ReturnType<ApprovalWorkflowChainEngine["createReviewAssignment"]>;
  } {
    const annotation = this.threadManager.createAnnotation(targetId, targetType, contextAnchor, authorUserId, commentText);
    const assignment = this.workflowChain.createReviewAssignment(targetId, stage, "usr_reviewer_1");

    this.decisionVault.dispatchNotification("usr_reviewer_1", "NewReviewAssigned", `Review requested for ${targetType}`);

    return {
      annotation,
      assignment,
    };
  }
}
