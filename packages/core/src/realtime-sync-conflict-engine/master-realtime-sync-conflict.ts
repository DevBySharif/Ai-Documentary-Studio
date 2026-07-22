import { OfflineChangeLogger } from "./offline-change-logger";
import { ConflictDetectorResolver } from "./conflict-detector-resolver";
import { ObjectLockingConcurrencyManager } from "./object-locking-concurrency-manager";
import { RealtimeEventSyncRecovery } from "./realtime-event-sync-recovery";
import { SyncModeType, VersionedObjectState } from "./sync-types";

/**
 * Master Real-Time Sync Conflict Engine (Main Vol 08 Part 02).
 * Core entry point for 5-stage sync pipeline (`Local Changes → Local State → Sync Engine → Cloud State → Collaborators`).
 */
export class MasterRealtimeSyncConflict {
  public readonly changeLogger = new OfflineChangeLogger();
  public readonly conflictResolver = new ConflictDetectorResolver();
  public readonly lockingManager = new ObjectLockingConcurrencyManager();
  public readonly eventSync = new RealtimeEventSyncRecovery();

  public synchronizeState(
    targetObjectId: string,
    operationType: string,
    editorUserId: string,
    deltaObj: unknown,
    remoteState: VersionedObjectState,
    syncMode: SyncModeType = "RealTime"
  ): { isSynchronized: boolean; conflictDetected: boolean } {
    const localOp = this.changeLogger.logLocalOperation(targetObjectId, operationType, editorUserId, deltaObj);
    const hasConflict = this.conflictResolver.detectConflict(localOp, remoteState);

    if (hasConflict) {
      this.conflictResolver.resolveConflict(localOp, remoteState, "AutomaticMerge");
    }

    this.changeLogger.markOperationSynchronized(localOp.operationId);
    this.eventSync.broadcastSyncEvent(`${operationType}Synced`, editorUserId);

    return {
      isSynchronized: true,
      conflictDetected: hasConflict,
    };
  }
}
