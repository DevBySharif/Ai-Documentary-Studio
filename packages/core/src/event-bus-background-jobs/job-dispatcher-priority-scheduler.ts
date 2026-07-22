import { BackgroundJobDescriptor, BackgroundJobType, JobPriorityLevel } from "./job-event-types";

/**
 * Job Dispatcher & Priority Scheduler Engine (Vol 09 Part 03 - Section 6, Section 7, Section 8).
 * Enqueues background jobs and schedules execution based on 5 priority levels (`Critical`, `High`, `Normal`, `Low`, `Background`).
 */
export class JobDispatcherPriorityScheduler {
  private jobQueue: BackgroundJobDescriptor[] = [];

  public dispatchJob(
    jobType: BackgroundJobType,
    payloadObj: unknown,
    priority: JobPriorityLevel = "Normal"
  ): BackgroundJobDescriptor {
    const job: BackgroundJobDescriptor = {
      jobId: `job_${Math.random().toString(36).substring(2, 7)}`,
      jobType,
      priority,
      currentState: "Queued",
      progressPercent: 0,
      payloadJson: JSON.stringify(payloadObj),
      attemptsMade: 0,
      retryPolicy: { maxAttempts: 3, initialDelayMs: 1000, backoffMultiplier: 2.0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.jobQueue.push(job);
    return job;
  }

  public getNextJobToExecute(): BackgroundJobDescriptor | undefined {
    const priorityOrder: Record<JobPriorityLevel, number> = {
      Critical: 5,
      High: 4,
      Normal: 3,
      Low: 2,
      Background: 1,
    };

    const queuedJobs = this.jobQueue.filter((j) => j.currentState === "Queued");
    if (queuedJobs.length === 0) return undefined;

    queuedJobs.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    const selected = queuedJobs[0];

    const idx = this.jobQueue.findIndex((j) => j.jobId === selected.jobId);
    if (idx !== -1) {
      this.jobQueue[idx] = { ...this.jobQueue[idx], currentState: "Scheduled", updatedAt: new Date() };
    }

    return this.jobQueue[idx];
  }
}
