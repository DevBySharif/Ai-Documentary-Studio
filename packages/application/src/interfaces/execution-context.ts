export interface ExecutionContext {
  readonly correlationId: string;
  readonly workspaceId?: string;
  readonly projectId?: string;
  readonly userPreferences?: Record<string, unknown>;
  readonly securityContext?: Record<string, unknown>;
  readonly cancellationToken?: {
    isCancellationRequested: boolean;
    throwIfRequested(): void;
  };
}
