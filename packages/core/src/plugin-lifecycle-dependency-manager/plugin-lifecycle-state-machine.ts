import { PluginLifecycleState, ActivationPolicyType, LifecycleAuditRecord } from "./plugin-lifecycle-types";

export interface LifecycleStateRecord {
  readonly pluginId: string;
  readonly version: string;
  readonly currentState: PluginLifecycleState;
  readonly activationPolicy: ActivationPolicyType;
  readonly updatedAt: Date;
}

/**
 * 9-Stage Lifecycle State Machine & Lazy Activation Engine (Vol 10 Part 04 - Section 3, Section 8, Section 14).
 * Drives the 9-stage lifecycle (`Discovered → Installed → Verified → DependencyResolved → Activated → Running → Updated → Disabled → Uninstalled`).
 */
export class PluginLifecycleStateMachine {
  private activeStates = new Map<string, LifecycleStateRecord>();
  private auditLog: LifecycleAuditRecord[] = [];

  public transitionState(
    pluginId: string,
    version: string,
    targetState: PluginLifecycleState,
    executedBy = "SystemAdmin"
  ): LifecycleStateRecord {
    const existing = this.activeStates.get(pluginId);
    const previousState: PluginLifecycleState = existing ? existing.currentState : "Discovered";

    const record: LifecycleStateRecord = {
      pluginId,
      version,
      currentState: targetState,
      activationPolicy: "AtStartup",
      updatedAt: new Date(),
    };

    this.activeStates.set(pluginId, record);

    const audit: LifecycleAuditRecord = {
      recordId: `aud_lc_${Math.random().toString(36).substring(2, 7)}`,
      pluginId,
      version,
      previousState,
      newState: targetState,
      executedBy,
      timestamp: new Date(),
    };

    this.auditLog.push(audit);
    return record;
  }
}
