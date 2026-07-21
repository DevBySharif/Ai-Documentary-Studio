export type EngineLifecycleStage =
  | "Initialize"
  | "LoadConfiguration"
  | "RegisterEvents"
  | "Ready"
  | "Processing"
  | "Idle"
  | "Shutdown";

export type ProductionCommand =
  | "CreateProject"
  | "GenerateStoryboard"
  | "GenerateImages"
  | "RenderVoice"
  | "BuildTimeline"
  | "ExportProject";

export type ProductionEventName =
  | "ProjectCreated"
  | "ResearchCompleted"
  | "ScriptApproved"
  | "StoryboardApproved"
  | "PromptGenerated"
  | "ImagesGenerated"
  | "NarrationApproved"
  | "TimelineUpdated"
  | "ReviewPassed"
  | "ExportCompleted";

export type StartupSequenceStep =
  | "Configuration"
  | "Logging"
  | "Storage"
  | "Database"
  | "Cache"
  | "EventBus"
  | "AIOrchestrator"
  | "CoreEngines"
  | "UI"
  | "BackgroundWorkers";

export interface ModuleDomainOwnership {
  readonly moduleName: string;
  readonly ownedEntities: ReadonlyArray<string>;
}

export interface BackgroundWorkerTask {
  readonly taskId: string;
  readonly taskType: "AiRequest" | "ThumbnailGeneration" | "WaveformAnalysis" | "ProxyCreation" | "MetadataIndexing" | "CacheCleanup";
  readonly status: "Queued" | "Running" | "Completed" | "Failed";
}
