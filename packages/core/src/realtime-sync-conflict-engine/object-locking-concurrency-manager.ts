import { ObjectLockType, EditingStrategyType } from "./sync-types";

export interface ActiveObjectLock {
  readonly lockId: string;
  readonly objectId: string;
  readonly lockType: ObjectLockType;
  readonly holderId: string;
  readonly expiresAt: Date;
}

/**
 * Object Locking Manager & Concurrency Coordinator (Vol 08 Part 02 - Section 10, Section 11).
 * Manages soft/hard/AI/review locks and coordinates Optimistic vs Pessimistic editing modes.
 */
export class ObjectLockingConcurrencyManager {
  private activeLocks = new Map<string, ActiveObjectLock>();

  public acquireLock(objectId: string, lockType: ObjectLockType, holderId: string, durationMins = 15): ActiveObjectLock | undefined {
    const existing = this.activeLocks.get(objectId);
    if (existing && existing.expiresAt > new Date()) {
      return undefined; // Lock already held
    }

    const lock: ActiveObjectLock = {
      lockId: `lck_${Math.random().toString(36).substring(2, 7)}`,
      objectId,
      lockType,
      holderId,
      expiresAt: new Date(Date.now() + durationMins * 60 * 1000),
    };

    this.activeLocks.set(objectId, lock);
    return lock;
  }

  public isObjectLocked(objectId: string): boolean {
    const lock = this.activeLocks.get(objectId);
    return !!lock && lock.expiresAt > new Date();
  }

  public getEditingStrategy(lockRequired: boolean): EditingStrategyType {
    return lockRequired ? "Pessimistic" : "Optimistic";
  }
}
