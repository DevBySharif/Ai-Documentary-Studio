export type ExportPresetType =
  | "YouTube4K"
  | "YouTube1080p"
  | "DocumentaryMaster"
  | "ArchiveMaster"
  | "Facebook"
  | "Instagram"
  | "TikTok"
  | "Vimeo"
  | "BroadcastReady"
  | "Custom";

export type ApprovalStageCategory =
  | "Research"
  | "Script"
  | "Storyboard"
  | "Assets"
  | "Narration"
  | "Timeline"
  | "FinalProduction";

export type RenderJobStatus = "Queued" | "Rendering" | "Completed" | "Failed" | "Cancelled";

export interface ReviewApprovalRecord {
  readonly category: ApprovalStageCategory;
  readonly reviewerName: string;
  readonly isApproved: boolean;
  readonly approvedAt: Date;
  readonly notes: string;
}

export interface ExportPresetDescriptor {
  readonly presetId: string;
  readonly name: string;
  readonly type: ExportPresetType;
  readonly resolution: string; // e.g. "3840x2160"
  readonly frameRate: number; // e.g. 24
  readonly codec: string; // e.g. "ProRes 422 HQ", "H.264"
  readonly targetBitrateMbps: number;
  readonly audioFormat: string; // e.g. "AAC 320kbps", "PCM 24-bit"
  readonly isSubtitleEmbedded: boolean;
}

export interface RenderJobItem {
  readonly jobId: string;
  readonly jobName: string;
  readonly presetName: string;
  readonly destinationPath: string;
  readonly progressPercent: number;
  readonly status: RenderJobStatus;
  readonly estimatedCompletionSecs: number;
  readonly createdAt: Date;
}

export interface DeliveryPackageManifest {
  readonly packageId: string;
  readonly masterVideoPath: string;
  readonly subtitlePath: string;
  readonly thumbnailPath: string;
  readonly citationReportPath: string;
  readonly reviewReportPath: string;
  readonly licenseDocPath: string;
  readonly createdAt: Date;
}

export interface FinalValidationResult {
  readonly isValid: boolean;
  readonly missingMediaCount: number;
  readonly offlineAssetsCount: number;
  readonly timelineConflictsCount: number;
  readonly unapprovedAssetsCount: number;
  readonly warnings: ReadonlyArray<string>;
}
