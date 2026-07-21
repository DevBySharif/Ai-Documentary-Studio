import type { RenderTask } from "./types.js";

export class GpuTaskManager {
  private allocated: RenderTask[] = [];
  private gpuMemory = 8192;
  private usedMemory = 0;

  allocate(tasks: RenderTask[]): void {
    const sorted = [...tasks].sort((a, b) => b.priority - a.priority);
    for (const task of sorted) {
      const needed = task.estimateMs;
      if (this.usedMemory + needed <= this.gpuMemory) {
        this.allocated.push(task);
        this.usedMemory += needed;
      }
    }
  }

  release(taskId: string): void {
    const idx = this.allocated.findIndex((t) => t.taskId === taskId);
    if (idx !== -1) {
      this.usedMemory -= this.allocated[idx].estimateMs;
      this.allocated.splice(idx, 1);
    }
  }

  releaseAll(): void {
    this.allocated = [];
    this.usedMemory = 0;
  }

  getUsage(): { allocated: number; usedMemory: number; totalMemory: number; utilization: number } {
    return {
      allocated: this.allocated.length,
      usedMemory: this.usedMemory,
      totalMemory: this.gpuMemory,
      utilization: this.gpuMemory > 0 ? this.usedMemory / this.gpuMemory : 0
    };
  }

  predictBottleneck(tasks: RenderTask[]): RenderTask | null {
    if (tasks.length === 0) return null;
    return tasks.reduce((a, b) => (a.estimateMs > b.estimateMs ? a : b));
  }
}
