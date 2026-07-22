import { LocalOperationLog } from "./sync-types";

/**
 * Offline-First Local Change Log & Pending Operation Queue (Vol 08 Part 02 - Section 4, Section 5, Section 7, Section 13).
 * Logs immutable operations locally when offline and queues them for automatic sync upon reconnection.
 */
export class OfflineChangeLogger {
  private logQueue: LocalOperationLog[] = [];
  private sequenceCounter = 1;

  public logLocalOperation(targetObjectId: string, operationType: string, editorUserId: string, deltaObj: unknown): LocalOperationLog {
    const op: LocalOperationLog = {
      operationId: `op_${Math.random().toString(36).substring(2, 7)}`,
      targetObjectId,
      operationType,
      editorUserId,
      deltaPayloadJson: JSON.stringify(deltaObj),
      sequenceNumber: this.sequenceCounter++,
      timestamp: new Date(),
      isSynchronized: false,
    };

    this.logQueue.push(op);
    return op;
  }

  public getPendingLocalOperations(): ReadonlyArray<LocalOperationLog> {
    return this.logQueue.filter((o) => !o.isSynchronized);
  }

  public markOperationSynchronized(operationId: string): void {
    const idx = this.logQueue.findIndex((o) => o.operationId === operationId);
    if (idx !== -1) {
      this.logQueue[idx] = { ...this.logQueue[idx], isSynchronized: true };
    }
  }
}
