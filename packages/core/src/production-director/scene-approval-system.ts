export class PDSceneApprovalSystem {
  private approved: Set<string> = new Set();
  private locked: Set<string> = new Set();
  private rejected: Set<string> = new Set();

  approve(sceneId: string): void {
    this.approved.add(sceneId);
    this.rejected.delete(sceneId);
  }

  reject(sceneId: string): void {
    this.rejected.add(sceneId);
    this.approved.delete(sceneId);
  }

  lock(sceneId: string): boolean {
    if (!this.approved.has(sceneId)) return false;
    this.locked.add(sceneId);
    return true;
  }

  unlock(sceneId: string): void {
    this.locked.delete(sceneId);
  }

  isApproved(sceneId: string): boolean {
    return this.approved.has(sceneId);
  }

  isLocked(sceneId: string): boolean {
    return this.locked.has(sceneId);
  }

  requestRegeneration(sceneId: string): boolean {
    if (!this.locked.has(sceneId)) return false;
    this.locked.delete(sceneId);
    this.approved.delete(sceneId);
    return true;
  }

  getApprovedCount(): number {
    return this.approved.size;
  }

  getLockedCount(): number {
    return this.locked.size;
  }
}
