export class WMProjectLocking {
  private locked: Set<string> = new Set();

  lock(projectId: string): boolean {
    if (this.locked.has(projectId)) return false;
    this.locked.add(projectId);
    return true;
  }

  unlock(projectId: string): void {
    this.locked.delete(projectId);
  }

  isLocked(projectId: string): boolean {
    return this.locked.has(projectId);
  }

  getLockedProjects(): string[] {
    return Array.from(this.locked);
  }
}
