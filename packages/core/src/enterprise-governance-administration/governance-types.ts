export type WorkspaceLifecycleState =
  | "Created"
  | "Active"
  | "Archived"
  | "ReadOnly"
  | "Deleted";

export type LicenseType =
  | "NamedUser"
  | "Floating"
  | "Team"
  | "Educational"
  | "Enterprise";

export type DelegatedAdminRoleType =
  | "OrganizationAdmin"
  | "DepartmentAdmin"
  | "WorkspaceAdmin"
  | "SecurityAdmin";

export interface DepartmentDescriptor {
  readonly departmentId: string;
  readonly departmentName: string; // e.g. "Research", "Production", "Marketing", "Education"
  readonly departmentLeadUserId: string;
  readonly memberUserIds: ReadonlyArray<string>;
}

export interface OrganizationDescriptor {
  readonly organizationId: string;
  readonly organizationName: string;
  readonly divisionsCount: number;
  readonly departments: ReadonlyArray<DepartmentDescriptor>;
  readonly primaryAdminUserId: string;
  readonly createdAt: Date;
}

export interface OrganizationPolicyRules {
  readonly approvedAiProviders: ReadonlyArray<string>;
  readonly dataRetentionDays: number;
  readonly exportRestrictionsEnabled: boolean;
  readonly promptGovernanceEnabled: boolean;
  readonly maxWorkspaceQuotaBytes: number;
}

export interface LicenseDescriptor {
  readonly licenseId: string;
  readonly organizationId: string;
  readonly licenseType: LicenseType;
  readonly allocatedSeatsCount: number;
  readonly activeUsedSeatsCount: number;
  readonly expiresAt: Date;
}

export interface EnterpriseAuditLogRecord {
  readonly auditId: string;
  readonly organizationId: string;
  readonly actorUserId: string;
  readonly actionCategory: "PolicyChange" | "RoleAssignment" | "WorkspaceLifecycle" | "LicenseChange" | "ComplianceEvent";
  readonly actionDetails: string;
  readonly timestamp: Date;
}
