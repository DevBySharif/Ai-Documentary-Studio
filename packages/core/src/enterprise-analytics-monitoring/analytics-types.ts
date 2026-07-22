export type DashboardCategoryType =
  | "Personal"
  | "Project"
  | "Workspace"
  | "Organization"
  | "AiOperations"
  | "Executive";

export type ReportCategoryType =
  | "Production"
  | "AiUsage"
  | "Financial"
  | "Collaboration"
  | "Security"
  | "Quality";

export interface ProjectDashboardMetrics {
  readonly projectId: string;
  readonly completionPercentage: number;
  readonly activeTasksCount: number;
  readonly pendingApprovalsCount: number;
  readonly tokensConsumed: number;
  readonly currentSpendUSD: number;
  readonly openReviewItemsCount: number;
}

export interface TeamProductivityMetrics {
  readonly completedTasksCount: number;
  readonly averageReviewTurnaroundMins: number;
  readonly averageApprovalDelayMins: number;
  readonly aiAssistedProductivityGainPercent: number;
  readonly assetProductionRatePerHour: number;
  readonly revisionFrequency: number;
}

export interface AiOperationsTelemetry {
  readonly activeAiJobsCount: number;
  readonly queueLength: number;
  readonly totalTokenConsumption: number;
  readonly averageLatencyMs: number;
  readonly retryRatePercent: number;
  readonly successRatePercent: number;
  readonly providerDistribution: Record<string, number>;
}

export interface BottleneckAlertDescriptor {
  readonly alertId: string;
  readonly bottleneckType: "LongReviewQueue" | "DelayedApproval" | "SlowAiProvider" | "ExcessiveRevisions";
  readonly severity: "Warning" | "Critical";
  readonly message: string;
  readonly recommendedAction: string;
  readonly timestamp: Date;
}

export interface KpiFrameworkMetrics {
  readonly avgDocumentaryCompletionMins: number;
  readonly firstPassAiAcceptanceRatePercent: number;
  readonly humanCorrectionRatePercent: number;
  readonly avgReviewCycleMins: number;
  readonly costPerCompletedProjectUSD: number;
  readonly overallAiProductivityGainFactor: number;
}
