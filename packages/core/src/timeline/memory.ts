import type { MasterTimeline, TimelineVersion } from "./types.js";

export interface TimelineMemoryEntry {
  projectId: string;
  versions: TimelineVersion[];
  optimizationHistory: Array<{
    version: number;
    change: string;
    reason: string;
    improvement: number;
  }>;
  imageReusePattern: Map<string, number>;
  motionPattern: Map<string, number>;
}

export class TimelineMemory {
  private store: Map<string, TimelineMemoryEntry> = new Map();

  init(projectId: string): TimelineMemoryEntry {
    const entry: TimelineMemoryEntry = {
      projectId,
      versions: [],
      optimizationHistory: [],
      imageReusePattern: new Map(),
      motionPattern: new Map(),
    };
    this.store.set(projectId, entry);
    return entry;
  }

  saveVersion(projectId: string, timeline: MasterTimeline, changelog: string): TimelineVersion {
    const entry = this.getOrInit(projectId);
    const version: TimelineVersion = {
      version: entry.versions.length + 1,
      timeline,
      changelog,
      createdAt: new Date().toISOString(),
    };
    entry.versions.push(version);
    return version;
  }

  getVersion(projectId: string, version?: number): MasterTimeline | undefined {
    const entry = this.store.get(projectId);
    if (!entry) return undefined;
    if (version === undefined) {
      return entry.versions[entry.versions.length - 1]?.timeline;
    }
    return entry.versions.find((v) => v.version === version)?.timeline;
  }

  recordOptimization(projectId: string, change: string, reason: string, improvement: number): void {
    const entry = this.getOrInit(projectId);
    entry.optimizationHistory.push({
      version: entry.versions.length,
      change,
      reason,
      improvement,
    });
  }

  trackImageReuse(projectId: string, imageId: string): void {
    const entry = this.getOrInit(projectId);
    const current = entry.imageReusePattern.get(imageId) ?? 0;
    entry.imageReusePattern.set(imageId, current + 1);
  }

  trackMotionPattern(projectId: string, motion: string): void {
    const entry = this.getOrInit(projectId);
    const current = entry.motionPattern.get(motion) ?? 0;
    entry.motionPattern.set(motion, current + 1);
  }

  getReuseCount(projectId: string, imageId: string): number {
    return this.store.get(projectId)?.imageReusePattern.get(imageId) ?? 0;
  }

  getVersionCount(projectId: string): number {
    return this.store.get(projectId)?.versions.length ?? 0;
  }

  clear(projectId: string): void {
    this.store.delete(projectId);
  }

  private getOrInit(projectId: string): TimelineMemoryEntry {
    return this.store.get(projectId) ?? this.init(projectId);
  }
}
