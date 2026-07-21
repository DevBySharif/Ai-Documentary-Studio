export class DNALocking {
  private locked: Set<string> = new Set();

  lock(dnaId: string): void {
    this.locked.add(dnaId);
  }

  unlock(dnaId: string): void {
    this.locked.delete(dnaId);
  }

  isLocked(dnaId: string): boolean {
    return this.locked.has(dnaId);
  }

  getLocked(): string[] {
    return Array.from(this.locked);
  }
}
