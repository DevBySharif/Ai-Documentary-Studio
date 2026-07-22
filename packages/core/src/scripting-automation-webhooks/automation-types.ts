export type ScriptCategoryType = "EventScripts" | "ScheduledScripts" | "ManualScripts" | "ConditionalWorkflows";

export type AutomationTriggerType =
  | "ProjectCreated"
  | "ScriptCompleted"
  | "AssetImported"
  | "ReviewApproved"
  | "ExportFinished"
  | "AiGenerationCompleted"
  | "UserLogin"
  | "WorkspaceArchived";

export type WorkflowActionType =
  | "ExecuteAiTask"
  | "SendNotification"
  | "CallWebhook"
  | "UpdateMetadata"
  | "ExportAssets"
  | "MoveFiles"
  | "TriggerAnotherWorkflow"
  | "InvokePluginCommand";

export interface ScriptExecutionReport {
  readonly scriptId: string;
  readonly category: ScriptCategoryType;
  readonly isSuccess: boolean;
  readonly executionTimeMs: number;
  readonly logOutput: string;
  readonly executedAt: Date;
}

export interface WebhookDescriptor {
  readonly webhookId: string;
  readonly targetUrl: string;
  readonly httpMethod: "GET" | "POST" | "PUT";
  readonly authHeader?: string;
  readonly retryPolicyMaxAttempts: number;
}

export interface AutomationGovernancePolicy {
  readonly maxExecutionTimeSeconds: number;
  readonly maxMemoryMB: number;
  readonly isExternalNetworkAllowed: boolean;
}
