export type HealthRemediationStage =
  | "Healthy"
  | "Warning"
  | "Degraded"
  | "Critical"
  | "Recovery";

export type SelfHealingActionType =
  | "RestartFailedWorker"
  | "RefreshToken"
  | "ReconnectService"
  | "RebuildCache"
  | "RestartScheduledJob";

export interface MaintenanceModeState {
  readonly isActive: boolean;
  readonly isReadOnlyAccessAllowed: boolean;
  readonly noticeMessage: string;
  readonly scheduledEndTimestamp?: Date;
}

export interface StartupDiagnosticReport {
  readonly reportId: string;
  readonly isConfigValid: boolean;
  readonly isDatabaseConnected: boolean;
  readonly isAiAvailable: boolean;
  readonly isStorageAccessible: boolean;
  readonly isGpuAvailable: boolean;
  readonly isReadyForStartup: boolean;
  readonly timestamp: Date;
}

export interface SupportBundleDescriptor {
  readonly bundleId: string;
  readonly platformVersion: string;
  readonly enabledModules: ReadonlyArray<string>;
  readonly logSnippet: string;
  readonly healthSummary: string;
  readonly isMasked: boolean;
  readonly generatedAt: Date;
}

export interface TroubleshootingWorkflowGuide {
  readonly guideId: string;
  readonly issueCategory: "AiProviderFailure" | "AuthError" | "StorageProblem" | "SyncFailure" | "RenderFailure";
  readonly steps: ReadonlyArray<string>;
  readonly recommendedFix: string;
}
