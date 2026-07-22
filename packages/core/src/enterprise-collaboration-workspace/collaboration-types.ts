export type WorkspaceCategoryType =
  | "Personal"
  | "Team"
  | "Organization"
  | "Enterprise"
  | "Educational";

export type ProductionRoleType =
  | "Producer"
  | "Director"
  | "Researcher"
  | "ScriptWriter"
  | "StoryboardArtist"
  | "AiOperator"
  | "Reviewer"
  | "Narrator"
  | "Administrator";

export type AssetVisibilityLevel =
  | "Private"
  | "ProjectShared"
  | "WorkspaceShared"
  | "OrganizationWide";

export interface WorkspaceMember {
  readonly memberId: string;
  readonly userId: string;
  readonly displayName: string;
  readonly role: ProductionRoleType;
  readonly status: "Active" | "Invited" | "Suspended";
  readonly joinedAt: Date;
}

export interface SharedAssetDescriptor {
  readonly assetId: string;
  readonly assetName: string;
  readonly ownerId: string;
  readonly visibility: AssetVisibilityLevel;
  readonly fileType: string;
  readonly sharedAt: Date;
}

export interface CollaborativeTaskAssignment {
  readonly taskId: string;
  readonly title: string;
  readonly assigneeType: "User" | "Team" | "AiAgent" | "Hybrid";
  readonly assigneeId: string;
  readonly deadline?: Date;
  readonly status: "Pending" | "InProgress" | "InReview" | "Completed";
}

export interface AiAttributionMetadata {
  readonly attributionId: string;
  readonly requestingUserId: string;
  readonly responsibleAiAgentId: string;
  readonly modelUsed: string;
  readonly generatedAt: Date;
}
