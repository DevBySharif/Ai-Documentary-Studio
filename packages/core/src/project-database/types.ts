export type PDDatabaseEngineType = "sqlite" | "postgresql" | "mysql" | "sqlserver";

export type PDEntityType =
  | "workspace"
  | "project"
  | "channel"
  | "channel_dna"
  | "script"
  | "prompt"
  | "scene"
  | "image"
  | "audio"
  | "timeline"
  | "motion"
  | "effect"
  | "subtitle"
  | "qa_report"
  | "export"
  | "asset"
  | "user"
  | "plugin"
  | "setting";

export type PDIndexType = "btree" | "hash" | "full_text" | "gin" | "gist";

export type PDMigrationStatus = "pending" | "running" | "completed" | "failed";

export interface PDEntityRecord {
  id: string;
  type: PDEntityType;
  projectId: string;
  createdDate: Date;
  updatedDate: Date;
  version: number;
  data: Record<string, unknown>;
  isDeleted: boolean;
}

export interface PDIndex {
  name: string;
  tableName: string;
  columns: string[];
  type: PDIndexType;
  unique: boolean;
}

export interface PDMigration {
  version: number;
  name: string;
  appliedDate: Date | null;
  status: PDMigrationStatus;
  checksum: string;
}

export interface PDTransactionResult {
  success: boolean;
  affectedRecords: number;
  error: string | undefined;
  rollback: boolean;
}

export interface PDAuditEntry {
  id: string;
  timestamp: Date;
  entityType: PDEntityType;
  entityId: string;
  action: string;
  userId: string;
  changes: Record<string, unknown>;
  immutable: true;
}

export interface PDEventStoreEntry {
  id: string;
  eventType: string;
  entityId: string;
  data: Record<string, unknown>;
  timestamp: Date;
  version: number;
}

export interface PDDBOutputContract {
  database: string;
  schema: number;
  transactions: boolean;
  status: "healthy" | "degraded" | "unhealthy";
}
