import { BackupSchedulerTargetManager } from "./backup-scheduler-target-manager";
import { IntegrityVerifierRecoveryEngine } from "./integrity-verifier-recovery-engine";
import { RpoRtoPolicyFailoverCoordinator } from "./rpo-rto-policy-failover-coordinator";
import { DisasterRecoveryTestRunner } from "./disaster-recovery-test-runner";
import { BackupCategoryType, BackupScheduleType, RestoreScopeType } from "./backup-recovery-types";

/**
 * Master Backup & Disaster Recovery Engine (Main Vol 09 Part 06).
 * Core entry point for 6-layer resilience architecture (`Production System → Continuous Backup → Recovery Storage → Integrity Verification → Recovery Engine → Operational Platform`).
 */
export class MasterBackupDisasterRecovery {
  public readonly schedulerManager = new BackupSchedulerTargetManager();
  public readonly verifierRecovery = new IntegrityVerifierRecoveryEngine();
  public readonly policyFailover = new RpoRtoPolicyFailoverCoordinator();
  public readonly testRunner = new DisasterRecoveryTestRunner();

  public createAndVerifyBackup(
    category: BackupCategoryType = "FullBackup",
    schedule: BackupScheduleType = "Daily"
  ): { archive: ReturnType<BackupSchedulerTargetManager["createBackupArchive"]>; verification: ReturnType<IntegrityVerifierRecoveryEngine["verifyBackupIntegrity"]> } {
    const archive = this.schedulerManager.createBackupArchive(category, schedule);
    const verification = this.verifierRecovery.verifyBackupIntegrity(archive);

    return {
      archive,
      verification,
    };
  }

  public performGranularRestore(
    archiveId: string,
    scope: RestoreScopeType = "Project"
  ): ReturnType<IntegrityVerifierRecoveryEngine["restoreFromArchive"]> {
    return this.verifierRecovery.restoreFromArchive(archiveId, scope);
  }
}
