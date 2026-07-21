import type { GRScheduledTask, GRRendererTask } from "./types.js";

export class GRGPUTaskScheduler {
  private tasks: GRScheduledTask[] = [];
  private index = 0;

  schedule(type: GRRendererTask, frame: number, cost: number, priority: number): string {
    const id = `task_${this.index++}`;
    this.tasks.push({ id, type, frame, estimatedCost: cost, priority });
    this.tasks.sort((a, b) => b.priority - a.priority);
    return id;
  }

  getNextTask(): GRScheduledTask | null {
    if (this.tasks.length === 0) return null;
    return this.tasks.shift()!;
  }

  getPendingTasks(): GRScheduledTask[] {
    return [...this.tasks];
  }

  getPendingCount(): number {
    return this.tasks.length;
  }

  getTotalEstimatedCost(): number {
    return this.tasks.reduce((s, t) => s + t.estimatedCost, 0);
  }

  clear(): void {
    this.tasks = [];
  }
}
