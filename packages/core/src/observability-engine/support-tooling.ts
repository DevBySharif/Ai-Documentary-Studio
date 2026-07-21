export type DebugMode =
  | "Normal"
  | "Verbose"
  | "Performance"
  | "AiDebug"
  | "RenderingDebug"
  | "PluginDebug";

export interface SupportToolSummary {
  readonly activeDebugMode: DebugMode;
  readonly activeInspectors: ReadonlyArray<string>;
}

/**
 * Support Tooling & Debug Modes (IB Part 24 - Section 9, Section 16, Section 17).
 * Built-in inspectors (LogViewer, HealthChecker, CacheInspector, PluginInspector, WorkflowInspector).
 */
export class SupportTooling {
  private currentMode: DebugMode = "Normal";
  private inspectors: string[] = [
    "LogViewer",
    "HealthChecker",
    "CacheInspector",
    "PluginInspector",
    "WorkflowInspector",
  ];

  public setDebugMode(mode: DebugMode): void {
    this.currentMode = mode;
  }

  public getSummary(): SupportToolSummary {
    return {
      activeDebugMode: this.currentMode,
      activeInspectors: this.inspectors,
    };
  }
}
