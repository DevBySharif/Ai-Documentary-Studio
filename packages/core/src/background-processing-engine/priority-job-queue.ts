import { BackgroundJobDescriptor, JobPriorityLevel } from "./job-types";

/**
 * Persistent Priority Job Queue & Task Dispatcher (Vol 06 Part 07 - Section 3, Section 6, Section 15).
 * Manages job submission and orders queue execution by priority level (Critical -> High -> Normal -> Low -> Background).
 */
export class PriorityJobQueue {
  private queue: BackgroundJobDescriptor[] = [];

  private priorityWeight: Record<JobPriorityLevel, number> = {
    Critical: 5,
    High: 4,
    Normal: 3,
    Low: 2,
    Background: 1,
  };

  public enqueueJob(job: BackgroundJobDescriptor): void {
    this.queue.push(job);
    this.sortQueue();
  }

  public dequeueNextJob(): BackgroundJobDescriptor | undefined {
    return this.queue.shift();
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => this.priorityWeight[b.priority] - this.priorityWeight[a.priority]);
  }

  public getPendingJobs(): ReadonlyArray<BackgroundJobDescriptor> {
    return this.queue;
  }
}
