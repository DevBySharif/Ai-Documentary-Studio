import type { CameraMemoryEntry, MotionMemoryEntry } from "./types.js";

export class CameraMemoryStore {
  private store = new Map<string, CameraMemoryEntry>();

  add(cameraId: string, entry: CameraMemoryEntry): void {
    this.store.set(cameraId, entry);
  }

  get(cameraId: string): CameraMemoryEntry | undefined {
    return this.store.get(cameraId);
  }

  wouldRepeat(cameraId: string, newMotion: string): boolean {
    const entry = this.get(cameraId);
    if (!entry) return false;
    return entry.previousMotion === newMotion;
  }

  suggestNextMotion(cameraId: string, availableMotions: string[]): string {
    const entry = this.get(cameraId);
    if (!entry) return availableMotions[0] || "hold";
    const lastUsed = entry.previousMotion;
    const different = availableMotions.filter((m) => m !== lastUsed);
    return different.length > 0 ? different[0] : lastUsed;
  }

  size(): number {
    return this.store.size;
  }
}

export class MotionMemoryStore {
  private store = new Map<string, MotionMemoryEntry[]>();

  add(entry: MotionMemoryEntry): void {
    const existing = this.store.get(entry.motionType) || [];
    existing.push(entry);
    this.store.set(entry.motionType, existing);
  }

  getHistory(motionType: string): MotionMemoryEntry[] {
    return this.store.get(motionType) || [];
  }

  getLastIntensity(motionType: string): string | undefined {
    const history = this.getHistory(motionType);
    return history[history.length - 1]?.intensity;
  }

  getTotalUseCount(): number {
    let count = 0;
    for (const entries of this.store.values()) {
      count += entries.length;
    }
    return count;
  }

  size(): number {
    return this.store.size;
  }
}
