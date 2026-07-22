import { StartupCompatibilityDiagnostics } from "./startup-compatibility-diagnostics";
import { SelfHealingAutomatedRepairEngine } from "./self-healing-automated-repair-engine";
import { MaintenanceModeRemediationCoordinator } from "./maintenance-mode-remediation-coordinator";
import { SupportBundleTroubleshootingTools } from "./support-bundle-troubleshooting-tools";
import { SelfHealingActionType } from "./operational-support-types";

/**
 * Master Platform Operational Support Engine (Main Vol 09 Part 08).
 * Core entry point for 5-layer operational architecture (`Platform → Health Monitor → Diagnostic Engine → Recovery Engine → Support Framework`).
 */
export class MasterPlatformOperationalSupport {
  public readonly diagnostics = new StartupCompatibilityDiagnostics();
  public readonly selfHealing = new SelfHealingAutomatedRepairEngine();
  public readonly maintenanceRemediation = new MaintenanceModeRemediationCoordinator();
  public readonly supportTools = new SupportBundleTroubleshootingTools();

  public initializePlatformAndCheckReadiness(): ReturnType<StartupCompatibilityDiagnostics["runStartupDiagnostics"]> {
    const report = this.diagnostics.runStartupDiagnostics();
    if (!report.isReadyForStartup) {
      throw new Error("Platform startup diagnostic failed!");
    }
    return report;
  }

  public executeSelfHealingAction(actionType: SelfHealingActionType, targetComponent: string): ReturnType<SelfHealingAutomatedRepairEngine["triggerSelfHealing"]> {
    return this.selfHealing.triggerSelfHealing(actionType, targetComponent);
  }
}
