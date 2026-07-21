export interface MasterAssetRecord {
  id: string;
  type: "image" | "video" | "audio" | "prompt" | "motion" | "timeline" | "symbol";
  version: number;
  storagePath: string;
  thumbnailPath: string;
  metadata: Record<string, unknown>;
  checksum: string;
  sizeBytes: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface MasterAssetVersion {
  version: number;
  assetId: string;
  storagePath: string;
  checksum: string;
  changeLog: string;
  createdAt: string;
  author: string;
}

export interface MasterProjectManifest {
  projectId: string;
  assets: MasterAssetRecord[];
  dependencies: string[];
  createdBy: string;
  createdAt: string;
  version: number;
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  assetCount: number;
  totalSizeBytes: number;
  assets: string[];
  status: "in_progress" | "completed" | "failed";
}

export interface ImportExportPackage {
  packageId: string;
  assets: MasterAssetRecord[];
  manifest: MasterProjectManifest;
  format: "json" | "zip";
  createdAt: string;
}

export interface AssetEvent {
  eventId: string;
  type: "created" | "updated" | "archived" | "restored" | "deleted" | "versioned" | "referenced";
  assetId: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface DigitalAssetTwin {
  assetId: string;
  previewUrl: string;
  embeddingVector: number[];
  semanticTags: string[];
  qualityScore: number;
  relationships: string[];
  lastSyncedAt: string;
}

export interface GovernanceRule {
  ruleId: string;
  name: string;
  description: string;
  enabled: boolean;
  action: "allow" | "deny" | "warn";
  matcher: Record<string, unknown>;
}
