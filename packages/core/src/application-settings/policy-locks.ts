export interface ASLockEntry {
  key: string;
  authorizedBy: string;
  timestamp: number;
  reason?: string;
}

export class ASPolicyLocks {
  private locks: Map<string, ASLockEntry> = new Map();

  lockSetting(key: string, authorizedBy: string, reason?: string): void {
    this.locks.set(key, {
      key,
      authorizedBy,
      timestamp: Date.now(),
      reason,
    });
  }

  unlockSetting(key: string, authorizedBy: string): boolean {
    const lock = this.locks.get(key);
    if (!lock) return false;
    if (lock.authorizedBy !== authorizedBy) return false;
    this.locks.delete(key);
    return true;
  }

  forceUnlock(key: string): boolean {
    return this.locks.delete(key);
  }

  isLocked(key: string): boolean {
    return this.locks.has(key);
  }

  getLockedSettings(): ASLockEntry[] {
    return Array.from(this.locks.values());
  }

  canModify(key: string, user: string): boolean {
    const lock = this.locks.get(key);
    if (!lock) return true;
    return lock.authorizedBy === user;
  }

  getLockInfo(key: string): ASLockEntry | undefined {
    return this.locks.get(key);
  }

  clearAllLocks(): void {
    this.locks.clear();
  }

  getLockCount(): number {
    return this.locks.size;
  }
}
