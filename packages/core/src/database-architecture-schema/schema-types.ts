export interface BaseUniversalEntity {
  readonly uuid: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdBy: string;
  readonly modifiedBy: string;
  readonly version: number;
  readonly status: string;
  readonly isDeleted: boolean;
  readonly metadata: Record<string, unknown>; // Extensible metadata (Section 19)
}

export interface ProjectEntity extends BaseUniversalEntity {
  readonly name: string;
  readonly description: string;
  readonly language: string;
  readonly targetPlatform: string;
  readonly resolution: string;
  readonly frameRate: number;
  readonly currentWorkflowStage: string;
}

export interface ScriptEntity extends BaseUniversalEntity {
  readonly projectId: string;
  readonly title: string;
  readonly approvalStage: string;
}

export interface SceneEntity extends BaseUniversalEntity {
  readonly scriptId: string;
  readonly sceneNumber: number;
  readonly title: string;
  readonly contentText: string;
}

export interface ShotEntity extends BaseUniversalEntity {
  readonly sceneId: string;
  readonly shotNumber: number;
  readonly cameraAngle: string;
  readonly durationSecs: number;
  readonly promptId?: string;
  readonly assetId?: string;
}

export interface PromptEntity extends BaseUniversalEntity {
  readonly projectId: string;
  readonly templateText: string;
  readonly providerName: string;
  readonly parentPromptId?: string;
}

export interface AssetEntity extends BaseUniversalEntity {
  readonly projectId: string;
  readonly fileName: string;
  readonly assetType: string;
  readonly mimeType: string;
  readonly fileLocationUrl: string;
  readonly currentVersionId: string;
}

export interface AssetVersionEntity extends BaseUniversalEntity {
  readonly parentAssetId: string;
  readonly versionNumber: number;
  readonly checksum: string;
  readonly promptId?: string;
}

export interface VoiceTrackEntity extends BaseUniversalEntity {
  readonly projectId: string;
  readonly speakerName: string;
  readonly emotion: string;
  readonly audioLocationUrl: string;
}

export interface TimelineEntity extends BaseUniversalEntity {
  readonly projectId: string;
  readonly fps: number;
  readonly totalFrames: number;
}

export interface AuditTrailRecord {
  readonly auditId: string;
  readonly entityUuid: string;
  readonly entityType: string;
  readonly previousValueJson: string;
  readonly newValueJson: string;
  readonly userId: string;
  readonly timestamp: Date;
  readonly reason?: string;
}
