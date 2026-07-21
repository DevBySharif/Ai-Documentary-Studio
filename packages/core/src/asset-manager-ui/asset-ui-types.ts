export type AssetType =
  | "Image"
  | "Video"
  | "Audio"
  | "VoiceRecording"
  | "Music"
  | "Document"
  | "PDF"
  | "Prompt"
  | "StoryboardPreview"
  | "GeneratedThumbnail"
  | "ExportedRender";

export type StorageLocationType = "Local" | "ExternalDrive" | "NetworkStorage" | "CloudStorage";

export interface AssetVersion {
  readonly versionNumber: number;
  readonly versionName: string; // e.g. "AI Upscaled", "Color Corrected"
  readonly fileUrl: string;
  readonly createdAt: Date;
}

export interface AssetDependency {
  readonly dependencyId: string;
  readonly targetComponent: "ScriptScene" | "StoryboardShot" | "TimelineTimestamp" | "Thumbnail" | "Trailer";
  readonly componentIdentifier: string; // e.g. "Scene 12", "Timeline 00:04:12"
}

export interface AssetItem {
  readonly assetId: string;
  readonly fileName: string;
  readonly assetType: AssetType;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly storageLocation: StorageLocationType;
  readonly isOnline: boolean;
  readonly isFavorite: boolean;
  readonly isApproved: boolean;
  readonly isLocked: boolean;
  readonly tags: ReadonlyArray<string>;
  readonly currentVersion: AssetVersion;
  readonly versionHistory: ReadonlyArray<AssetVersion>;
  readonly dependencies: ReadonlyArray<AssetDependency>;
  readonly usageCount: number;
  readonly createdAt: Date;
}

export interface CollectionDescriptor {
  readonly collectionId: string;
  readonly name: string;
  readonly description: string;
  readonly assetIds: ReadonlyArray<string>;
}

export interface SmartFolderRule {
  readonly folderId: string;
  readonly name: string;
  readonly ruleType: "Unused" | "ApprovedImages" | "MissingMetadata" | "AiGenerated" | "RecentlyAdded" | "NeedsReview";
  readonly filterQuery: string;
}

export interface AssetHealthIssue {
  readonly issueId: string;
  readonly assetId: string;
  readonly issueType: "MissingFile" | "BrokenLink" | "CorruptedMedia" | "DuplicateAsset" | "LargeStorageUsage";
  readonly description: string;
  readonly suggestedFix: string;
}
