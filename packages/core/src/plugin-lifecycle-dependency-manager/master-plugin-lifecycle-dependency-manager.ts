import { InstallationSourceValidator } from "./installation-source-validator";
import { DependencyGraphResolver } from "./dependency-graph-resolver";
import { PluginLifecycleStateMachine } from "./plugin-lifecycle-state-machine";
import { UpdateMigrationRollbackEngine } from "./update-migration-rollback-engine";
import { InstallationSourceType } from "./plugin-lifecycle-types";

/**
 * Master Plugin Lifecycle & Dependency Manager Engine (Main Vol 10 Part 04).
 * Core entry point for 9-stage lifecycle management (`Discovered → Installed → Verified → DependencyResolved → Activated → Running → Updated → Disabled → Uninstalled`).
 */
export class MasterPluginLifecycleDependencyManager {
  public readonly validator = new InstallationSourceValidator();
  public readonly resolver = new DependencyGraphResolver();
  public readonly stateMachine = new PluginLifecycleStateMachine();
  public readonly updateRollback = new UpdateMigrationRollbackEngine();

  public installAndActivatePlugin(
    pluginId: string,
    version: string,
    source: InstallationSourceType = "OfficialMarketplace"
  ): ReturnType<PluginLifecycleStateMachine["transitionState"]> {
    const validation = this.validator.validatePackage(pluginId, source);
    if (!validation.isPackageValid) {
      throw new Error("Plugin package validation failed!");
    }

    this.stateMachine.transitionState(pluginId, version, "Installed");
    this.stateMachine.transitionState(pluginId, version, "Verified");
    this.stateMachine.transitionState(pluginId, version, "DependencyResolved");
    return this.stateMachine.transitionState(pluginId, version, "Activated");
  }
}
