import { BackgroundWorkerTask } from "./dependency-types";

/**
 * Background Worker Queue & Lazy Module Loading Controller (Vol 05 Part 02 - Section 15, Section 16).
 * Manages background workers (AI requests, thumbnail gen, waveform analysis, proxy creation) and lazy-loads heavy modules on demand.
 */
export class BackgroundWorkerQueue {
  private activeTasks: BackgroundWorkerTask[] = [];
  private loadedModules = new Set<string>(["ProjectManager", "ResearchEngine"]);

  public enqueueWorkerTask(taskType: BackgroundWorkerTask["taskType"]): BackgroundWorkerTask {
    const task: BackgroundWorkerTask = {
      taskId: `wrk_${Math.random().toString(36).substring(2, 7)}`,
      taskType,
      status: "Queued",
    };
    this.activeTasks.push(task);
    return task;
  }

  public lazyLoadModule(moduleName: string): boolean {
    if (this.loadedModules.has(moduleName)) return true;
    this.loadedModules.add(moduleName);
    return true;
  }

  public getLoadedModules(): ReadonlyArray<string> {
    return Array.from(this.loadedModules);
  }
}
