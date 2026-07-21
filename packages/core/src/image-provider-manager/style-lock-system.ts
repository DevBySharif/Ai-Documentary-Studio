import { IPStyleLock } from "./types";

export class IPStyleLockSystem {
  private locks: Map<string, IPStyleLock> = new Map();

  setLock(projectId: string, lock: IPStyleLock): void {
    this.locks.set(projectId, { ...lock });
  }

  getLock(projectId: string): IPStyleLock | undefined {
    return this.locks.get(projectId);
  }

  hasLock(projectId: string): boolean {
    return this.locks.has(projectId);
  }

  removeLock(projectId: string): boolean {
    return this.locks.delete(projectId);
  }

  applyToPrompt(projectId: string, prompt: string): string {
    const lock = this.locks.get(projectId);
    if (!lock) {
      return prompt;
    }
    const styleConstraints = [
      `art style: ${lock.artStyle}`,
      `color palette: ${lock.colorPalette.join(", ")}`,
      `lighting: ${lock.lighting}`,
      `composition: ${lock.composition}`,
      `brush style: ${lock.brushStyle}`,
      `rendering: ${lock.renderingStyle}`,
    ];
    return `${prompt}, ${styleConstraints.join(", ")}`;
  }

  getAllLocks(): Map<string, IPStyleLock> {
    return new Map(this.locks);
  }
}
