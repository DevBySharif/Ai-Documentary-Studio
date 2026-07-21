import { Job, JobPriority } from './types';

export class PriorityQueue {
  private queues: Record<JobPriority, Job[]> = {
    Critical: [],
    High: [],
    Normal: [],
    Low: [],
    Background: [],
  };

  private readonly priorityOrder: JobPriority[] = [
    "Critical",
    "High",
    "Normal",
    "Low",
    "Background"
  ];

  enqueue(job: Job): void {
    job.state = "Queued";
    this.queues[job.priority].push(job);
  }

  dequeue(): Job | undefined {
    for (const priority of this.priorityOrder) {
      if (this.queues[priority].length > 0) {
        return this.queues[priority].shift();
      }
    }
    return undefined;
  }

  remove(jobId: string): boolean {
    for (const priority of this.priorityOrder) {
      const queue = this.queues[priority];
      const index = queue.findIndex(j => j.id === jobId);
      if (index !== -1) {
        queue.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  peek(): Job | undefined {
    for (const priority of this.priorityOrder) {
      if (this.queues[priority].length > 0) {
        return this.queues[priority][0];
      }
    }
    return undefined;
  }

  get length(): number {
    return this.priorityOrder.reduce((acc, p) => acc + this.queues[p].length, 0);
  }

  getJobs(): Job[] {
    const allJobs: Job[] = [];
    for (const priority of this.priorityOrder) {
      allJobs.push(...this.queues[priority]);
    }
    return allJobs;
  }

  clear(): void {
    for (const priority of this.priorityOrder) {
      this.queues[priority] = [];
    }
  }
}
