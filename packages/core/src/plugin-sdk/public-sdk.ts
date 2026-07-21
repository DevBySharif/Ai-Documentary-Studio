import { PluginCapability } from "./plugin-manifest";

/**
 * Stable Public SDK Interfaces (IB Part 22 - Section 7, Section 20).
 * Plugins communicate ONLY through these documented APIs.
 */

export interface TimelineApi {
  readTracks(): Promise<ReadonlyArray<unknown>>;
  readClips(trackId: string): Promise<ReadonlyArray<unknown>>;
  createClip(trackId: string, assetId: string, startFrame: number): Promise<string>;
  insertMarker(frame: number, label: string): Promise<string>;
}

export interface AssetApi {
  searchAssets(query: string): Promise<ReadonlyArray<unknown>>;
  getAssetMetadata(assetId: string): Promise<unknown>;
}

export interface ProjectApi {
  getProjectMetadata(): Promise<unknown>;
}

export interface AiApi {
  submitAiTask(taskType: string, prompt: string): Promise<unknown>;
  publishAiResult(taskId: string, result: unknown): Promise<void>;
}

export interface WorkflowApi {
  triggerWorkflow(templateName: string): Promise<string>;
}

export interface EventApi {
  subscribe(eventName: string, callback: (payload: unknown) => void): () => void;
}

export interface RenderApi {
  registerPreset(presetName: string, config: unknown): void;
  triggerExport(presetName: string, destinationPath: string): Promise<string>;
}

export interface SettingsApi {
  getSetting<T>(key: string): T | undefined;
  setSetting<T>(key: string, value: T): void;
}

export interface LoggingApi {
  logInfo(message: string): void;
  logError(message: string, error?: unknown): void;
}

export interface PublicSdk {
  readonly timeline: TimelineApi;
  readonly asset: AssetApi;
  readonly project: ProjectApi;
  readonly ai: AiApi;
  readonly workflow: WorkflowApi;
  readonly event: EventApi;
  readonly render: RenderApi;
  readonly settings: SettingsApi;
  readonly logging: LoggingApi;
}
