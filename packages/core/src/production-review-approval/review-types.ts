export type ReviewTargetType =
  | "DocumentaryScript"
  | "Scene"
  | "Storyboard"
  | "Timeline"
  | "Image"
  | "Thumbnail"
  | "Narration"
  | "Subtitle"
  | "Metadata"
  | "AiOutput";

export type ReviewStatusState =
  | "Open"
  | "InReview"
  | "NeedsChanges"
  | "Resolved"
  | "Approved"
  | "Archived";

export type ApprovalStageType =
  | "ResearchApproval"
  | "ScriptApproval"
  | "StoryboardApproval"
  | "NarrationApproval"
  | "FinalExportApproval";

export interface ContextualAnnotation {
  readonly annotationId: string;
  readonly targetId: string;
  readonly targetType: ReviewTargetType;
  readonly contextAnchor: string; // e.g. "Highlighted sentence: 'The battle began at dawn'", "Timestamp: 01:23"
  readonly authorUserId: string;
  readonly initialComment: string;
  readonly createdAt: Date;
}

export interface CommentThreadItem {
  readonly commentId: string;
  readonly annotationId: string;
  readonly authorUserId: string;
  readonly text: string;
  readonly isAiSuggestion: boolean;
  readonly timestamp: Date;
}

export interface ApprovalDecisionRecord {
  readonly decisionId: string;
  readonly stage: ApprovalStageType;
  readonly reviewerUserId: string;
  readonly decisionOutcome: "Approved" | "NeedsChanges" | "Rejected";
  readonly comments: string;
  readonly requestedRevisions: ReadonlyArray<string>;
  readonly timestamp: Date;
}

export interface ReviewAssignmentDescriptor {
  readonly assignmentId: string;
  readonly targetId: string;
  readonly stage: ApprovalStageType;
  readonly assignedToId: string;
  readonly assignedToType: "User" | "Team" | "Role" | "AiAgent";
  readonly dueDate?: Date;
  readonly status: ReviewStatusState;
}
