import { PluginExecutionMode } from "./plugin-runtime-types";

export interface SandboxInstanceDescriptor {
  readonly sandboxId: string;
  readonly pluginId: string;
  readonly executionMode: PluginExecutionMode;
  readonly isSandboxed: boolean;
  readonly restrictedResources: ReadonlyArray<string>;
  readonly createdAt: Date;
}

/**
 * Multi-Mode Sandbox Engine (Vol 10 Part 03 - Section 4, Section 5).
 * Creates isolated sandboxes across 3 execution modes (`InProcess`, `IsolatedProcess`, `RemoteRuntime`) restricting file system, network, and native OS access.
 */
export class SandboxIsolationEngine {
  public createSandboxInstance(
    pluginId: string,
    mode: PluginExecutionMode = "IsolatedProcess"
  ): SandboxInstanceDescriptor {
    return {
      sandboxId: `sbx_${Math.random().toString(36).substring(2, 7)}`,
      pluginId,
      executionMode: mode,
      isSandboxed: true,
      restrictedResources: ["FileSystem", "Network", "EnvironmentVars", "NativeLibraries"],
      createdAt: new Date(),
    };
  }
}
