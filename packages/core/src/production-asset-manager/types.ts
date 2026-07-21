export type PAAssetType =
  | "script"
  | "prompt"
  | "image"
  | "voice"
  | "music"
  | "sound_effect"
  | "subtitle"
  | "motion_data"
  | "timeline_data"
  | "effects"
  | "render_cache"
  | "qa_report"
  | "thumbnail"
  | "export_file"
  | "project_metadata";

export type PAAssetStatus =
  | "generated"
  | "validated"
  | "approved"
  | "used"
  | "archived"
  | "deleted";

export type PAStorageTier = "hot" | "warm" | "archive";

export type PARelationshipType = "depends_on" | "derived_from" | "used_in" | "replaced_by";

export interface PAAssetMetadata {
  assetId: string;
  assetType: PAAssetType;
  projectId: string;
  sceneId?: string;
  createdDate: string;
  modifiedDate: string;
  version: number;
  status: PAAssetStatus;
  provider: string;
  channelDnaVersion: string;
  validationStatus: string;
  storageTier: PAStorageTier;
  size: number;
  hash: string;
}

export interface PAAssetVersion {
  versionNumber: number;
  assetId: string;
  filePath: string;
  hash: string;
  createdDate: string;
  createdBy: string;
  changes: string;
}

export interface PAAssetRelationship {
  sourceAssetId: string;
  targetAssetId: string;
  relationshipType: PARelationshipType;
}

export interface PACacheEntry {
  key: string;
  data: unknown;
  ttl: number;
  createdDate: string;
  accessCount: number;
}

export interface PAOutputContract {
  assetId: string;
  type: PAAssetType;
  version: number;
  validated: boolean;
  status: PAAssetStatus;
}
