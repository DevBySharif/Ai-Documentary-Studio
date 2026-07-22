import { SandboxIsolationEngine } from "./sandbox-isolation-engine";
import { ResourceGovernanceQuotaMonitor } from "./resource-governance-quota-monitor";
import { SecureIpcPermissionEnforcer } from "./secure-ipc-permission-enforcer";
import { CrashIsolatorSupervisorEngine } from "./crash-isolator-supervisor-engine";
import { PluginExecutionMode, PluginPermissionType } from "./plugin-runtime-types";

/**
 * Master Plugin Runtime Sandboxing Engine (Main Vol 10 Part 03).
 * Core entry point for 5-layer runtime architecture (`Core Platform → Plugin Runtime Manager → Sandbox → Plugin Instance → Extension APIs`).
 */
export class MasterPluginRuntimeSandboxing {
  public readonly sandboxEngine = new SandboxIsolationEngine();
  public readonly quotaMonitor = new ResourceGovernanceQuotaMonitor();
  public readonly ipcGateway = new SecureIpcPermissionEnforcer();
  public readonly supervisorEngine = new CrashIsolatorSupervisorEngine();

  public spawnSandboxedPlugin(
    pluginId: string,
    permissions: PluginPermissionType[] = [],
    mode: PluginExecutionMode = "IsolatedProcess"
  ): {
    sandbox: ReturnType<SandboxIsolationEngine["createSandboxInstance"]>;
    quota: ReturnType<ResourceGovernanceQuotaMonitor["getResourceQuota"]>;
    health: ReturnType<CrashIsolatorSupervisorEngine["samplePluginHealth"]>;
  } {
    const sandbox = this.sandboxEngine.createSandboxInstance(pluginId, mode);
    this.ipcGateway.grantPermissions(pluginId, permissions);
    const quota = this.quotaMonitor.getResourceQuota(pluginId);
    const health = this.supervisorEngine.samplePluginHealth(pluginId);

    return {
      sandbox,
      quota,
      health,
    };
  }
}
