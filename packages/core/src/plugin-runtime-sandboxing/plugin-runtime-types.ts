export type PluginExecutionMode = "InProcess" | "IsolatedProcess" | "RemoteRuntime";

export type PluginPermissionType =
  | "ProjectAccess"
  | "AssetAccess"
  | "AiExecution"
  | "InternetConnectivity"
  | "ClipboardAccess"
  | "NotificationDelivery";

export type IpcChannelType = "RequestResponse" | "EventPublishing" | "Notifications" | "StreamingData";

export interface PluginResourceQuota {
  readonly maxMemoryMB: number;
  readonly maxCpuPercentage: number;
  readonly maxConcurrentTasks: number;
  readonly maxNetworkRequestsPerMin: number;
  readonly maxAiRequestsPerMin: number;
}

export interface PluginRuntimeHealthStatus {
  readonly pluginId: string;
  readonly executionMode: PluginExecutionMode;
  readonly isHeartbeatHealthy: boolean;
  readonly currentMemoryMB: number;
  readonly currentCpuPercent: number;
  readonly activeTasksCount: number;
  readonly lastHeartbeatAt: Date;
}

export interface PluginCrashIsolationReport {
  readonly crashId: string;
  readonly pluginId: string;
  readonly errorMessage: string;
  readonly isCoreAffected: boolean; // Always false due to crash isolation
  readonly recoveryActionTaken: string;
  readonly crashedAt: Date;
}
