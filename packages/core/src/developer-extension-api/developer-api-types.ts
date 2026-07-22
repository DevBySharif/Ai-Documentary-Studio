export type ApiClassificationLevel = "Public" | "Partner" | "Internal";

export type ApiCategoryGroup = "Project" | "Asset" | "Workflow" | "AI" | "UI";

export interface SemVerVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export interface ExtensionExecutionContext {
  readonly workspaceId: string;
  readonly activeProjectId?: string;
  readonly userId: string;
  readonly permissions: ReadonlyArray<string>;
  readonly configJson: string;
}

export interface PublicApiResult<T> {
  readonly isSuccess: boolean;
  readonly data?: T;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly diagnosticMetadata?: Record<string, unknown>;
}

export interface RegisteredCommandDescriptor {
  readonly commandId: string;
  readonly title: string;
  readonly shortcut?: string;
  readonly category: string;
  readonly handlerFn: () => void;
}

export interface CapabilityNegotiationReport {
  readonly pluginId: string;
  readonly isCompatible: boolean;
  readonly missingCapabilities: ReadonlyArray<string>;
  readonly missingPermissions: ReadonlyArray<string>;
}
