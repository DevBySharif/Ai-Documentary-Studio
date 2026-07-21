export type UserRole = "Administrator" | "Editor" | "Reviewer" | "Viewer";

export type ActionPermission =
  | "CreateProject"
  | "EditScript"
  | "ApproveStoryboard"
  | "DeleteAssets"
  | "ExportProject"
  | "ModifySettings"
  | "InstallPlugins";

export type SecurityLayerType =
  | "ApplicationSecurity"
  | "Identity"
  | "Authorization"
  | "StorageProtection"
  | "NetworkSecurity"
  | "IntegrityVerification"
  | "Audit";

export interface UserProfile {
  readonly userId: string;
  readonly displayName: string;
  readonly role: UserRole;
  readonly preferences: Record<string, unknown>;
  readonly auditIdentifier: string;
}

export interface AuthSessionDescriptor {
  readonly sessionId: string;
  readonly userId: string;
  readonly role: UserRole;
  readonly createdAt: Date;
  readonly expiresAt?: Date;
  readonly activePermissions: ReadonlyArray<ActionPermission>;
}

export interface DigitalSignatureRecord {
  readonly signatureId: string;
  readonly archiveChecksum: string;
  readonly signedBy: string;
  readonly signatureHash: string;
  readonly signedAt: Date;
}
