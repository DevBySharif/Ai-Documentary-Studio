import type { PDScheduledTask, PDEngineType, PDScheduleMode } from "./types.js";

export class PDTaskScheduler {
  private tasks: PDScheduledTask[] = [];
  private index = 0;

  schedule(engine: PDEngineType, mode: PDScheduleMode, priority: number, duration: number, dependencies: string[]): string {
    const id = `task_${this.index++}_${engine}`;
    this.tasks.push({ id, engine, mode, priority, estimatedDuration: duration, dependencies });
    this.tasks.sort((a, b) => b.priority - a.priority);
    return id;
  }

  getNextTask(): PDScheduledTask | null {
    const ready = this.tasks.filter((t) => t.dependencies.length === 0);
    if (ready.length === 0) return null;
    return ready.sort((a, b) => b.priority - a.priority)[0];
  }

  completeTask(id: string): void {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
      for (const t of this.tasks) {
        t.dependencies = t.dependencies.filter((d) => d !== id);
      }
    }
  }

  getPendingTasks(): PDScheduledTask[] {
    return [...this.tasks];
  }

  clear(): void {
    this.tasks = [];
    this.index = 0;
  }
}
