export type AuthMethodType =
  | "UsernamePassword"
  | "EmailVerification"
  | "MultiFactorAuth"
  | "OrganizationSSO"
  | "ApiToken"
  | "EnterpriseIdentityProvider";

export type EnterpriseRoleType =
  | "Owner"
  | "Administrator"
  | "Producer"
  | "Editor"
  | "Reviewer"
  | "Researcher"
  | "Viewer"
  | "Guest";

export type AssetPermissionAction =
  | "View"
  | "Comment"
  | "Edit"
  | "Review"
  | "Approve"
  | "Export"
  | "Delete"
  | "Share";

export type AiPermissionCapability =
  | "GenerateScript"
  | "GenerateImages"
  | "UsePremiumModels"
  | "ExecuteBulkOperations"
  | "AccessSensitiveMemory";

export interface IdentityDescriptor {
  readonly userId: string;
  readonly displayName: string;
  readonly email: string;
  readonly workspaceMemberships: ReadonlyArray<string>;
  readonly assignedRoles: ReadonlyArray<EnterpriseRoleType>;
  readonly department?: string;
  readonly isMfaEnabled: boolean;
  readonly status: "Active" | "Suspended" | "Pending";
}

export interface AuthSessionState {
  readonly sessionId: string;
  readonly userId: string;
  readonly deviceInformation: string;
  readonly authMethod: AuthMethodType;
  readonly loginTime: Date;
  readonly expiresAt: Date;
  readonly isRevoked: boolean;
}

export interface SecurityAuditRecord {
  readonly auditId: string;
  readonly userId: string;
  readonly actionName: string;
  readonly resourceId: string;
  readonly decision: "Granted" | "Denied";
  readonly ipAddress: string;
  readonly timestamp: Date;
}
