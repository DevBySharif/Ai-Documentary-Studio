import { ApprovalDecisionRecord, ApprovalStageType } from "./review-types";

export interface ReviewNotificationEvent {
  readonly notificationId: string;
  readonly recipientUserId: string;
  readonly eventType: string; // e.g. "NewReviewAssigned", "CommentAdded", "ApprovalRequested"
  readonly message: string;
  readonly timestamp: Date;
}

/**
 * Immutable Decision History Vault & Notification Event Dispatcher (Vol 08 Part 04 - Section 12, Section 13, Section 14).
 * Maintains immutable approval decision audit records and dispatches notification events.
 */
export class ImmutableDecisionNotificationVault {
  private decisions: ApprovalDecisionRecord[] = [];
  private notifications: ReviewNotificationEvent[] = [];

  public recordApprovalDecision(
    stage: ApprovalStageType,
    reviewerUserId: string,
    decisionOutcome: "Approved" | "NeedsChanges" | "Rejected",
    comments: string,
    requestedRevisions: string[] = []
  ): ApprovalDecisionRecord {
    const record: ApprovalDecisionRecord = {
      decisionId: `dec_rev_${Math.random().toString(36).substring(2, 7)}`,
      stage,
      reviewerUserId,
      decisionOutcome,
      comments,
      requestedRevisions,
      timestamp: new Date(),
    };

    this.decisions.push(record);
    return record;
  }

  public dispatchNotification(recipientUserId: string, eventType: string, message: string): ReviewNotificationEvent {
    const notif: ReviewNotificationEvent = {
      notificationId: `notif_${Math.random().toString(36).substring(2, 7)}`,
      recipientUserId,
      eventType,
      message,
      timestamp: new Date(),
    };

    this.notifications.push(notif);
    return notif;
  }
}
