import { SyncConflictDescriptor, LocalOperationLog, VersionedObjectState, ConflictResolutionStrategy } from "./sync-types";

/**
 * Conflict Detector & 5-Strategy Resolver Engine (Vol 08 Part 02 - Section 8, Section 9).
 * Detects concurrent edit conflicts and applies resolution strategies (`AutomaticMerge`, `LastWriterWins`, `ManualMerge`, `WorkspacePolicy`, `HumanApproval`).
 */
export class ConflictDetectorResolver {
  public detectConflict(localOp: LocalOperationLog, remoteState: VersionedObjectState): boolean {
    // Conflict occurs if local op relies on an outdated sequence number
    return localOp.sequenceNumber <= remoteState.changeSequenceNumber;
  }

  public resolveConflict(
    localOp: LocalOperationLog,
    remoteState: VersionedObjectState,
    preferredStrategy: ConflictResolutionStrategy = "AutomaticMerge"
  ): SyncConflictDescriptor {
    let resolvedJson = remoteState.dataJson;

    if (preferredStrategy === "LastWriterWins") {
      resolvedJson = localOp.timestamp > remoteState.lastModifiedTimestamp ? localOp.deltaPayloadJson : remoteState.dataJson;
    } else if (preferredStrategy === "AutomaticMerge") {
      resolvedJson = JSON.stringify({
        merged: true,
        remote: remoteState.dataJson,
        localDelta: localOp.deltaPayloadJson,
      });
    }

    return {
      conflictId: `cfl_sync_${Math.random().toString(36).substring(2, 7)}`,
      objectId: localOp.targetObjectId,
      localOperation: localOp,
      remoteState,
      selectedStrategy: preferredStrategy,
      resolvedStateJson: resolvedJson,
      isResolved: preferredStrategy !== "HumanApproval",
    };
  }
}
