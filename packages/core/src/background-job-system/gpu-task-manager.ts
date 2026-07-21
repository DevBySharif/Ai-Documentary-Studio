import { Job } from './types';

export interface GPUTask {
  jobId: string;
  memoryRequirementMB: number;
  priority: number;
}

export class GPUTaskManager {
  private totalMemoryMB: number = 8192; // e.g., 8GB GPU
  private usedMemoryMB: number = 0;
  private runningTasks: Map<string, GPUTask> = new Map();
  private queue: GPUTask[] = [];

  enqueueTask(task: GPUTask): void {
    this.queue.push(task);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  canRunNextTask(): boolean {
    if (this.queue.length === 0) return false;
    const nextTask = this.queue[0];
    return this.totalMemoryMB - this.usedMemoryMB >= nextTask.memoryRequirementMB;
  }

  startNextTask(): GPUTask | undefined {
    if (this.canRunNextTask()) {
      const task = this.queue.shift()!;
      this.usedMemoryMB += task.memoryRequirementMB;
      this.runningTasks.set(task.jobId, task);
      return task;
    }
    return undefined;
  }

  completeTask(jobId: string): void {
    const task = this.runningTasks.get(jobId);
    if (task) {
      this.usedMemoryMB -= task.memoryRequirementMB;
      this.runningTasks.delete(jobId);
    }
  }

  handleGPUFailure(): void {
    // Logic to gracefully recover and clear memory state
    this.usedMemoryMB = 0;
    this.runningTasks.clear();
    console.error("GPU Failure detected. Task manager cleared running tasks for recovery.");
  }
}
