export type LayerType =
  | "Presentation"
  | "Application"
  | "Domain"
  | "AIOrchestration"
  | "Infrastructure"
  | "Storage";

export type EngineContractType =
  | "ResearchEngine"
  | "ScriptEngine"
  | "StoryboardEngine"
  | "PromptEngine"
  | "ImageEngine"
  | "VoiceEngine"
  | "TimelineEngine"
  | "ExportEngine";

export type SharedServiceType =
  | "LoggingService"
  | "NotificationService"
  | "SettingsService"
  | "StorageService"
  | "QueueService"
  | "AuthenticationService"
  | "UpdateService";

export interface DomainEvent<T = unknown> {
  readonly eventId: string;
  readonly eventName: string; // e.g. "ScriptApproved", "AssetsGenerated"
  readonly publisherLayer: LayerType;
  readonly payload: T;
  readonly publishedAt: Date;
}

export interface EngineContractDescriptor {
  readonly engineType: EngineContractType;
  readonly publicMethods: ReadonlyArray<string>;
  readonly isHealthy: boolean;
}
