import { BackgroundJobDescriptor } from "./job-event-types";

export interface WorkerCapabilityDescriptor {
  readonly workerId: string;
  readonly workerCategory: "AiWorker" | "RenderWorker" | "SearchWorker" | "ExportWorker";
  readonly isBusy: boolean;
}

/**
 * Distributed Worker Pool, Horizontal Scaler & Progress Tracker (Vol 09 Part 03 - Section 11, Section 12, Section 13, Section 14).
 * Coordinates worker pools, publishes 0–100% progress telemetry, and handles best-effort job cancellations.
 */
export class DistributedWorkerPoolProgressTracker {
  private workers: WorkerCapabilityDescriptor[] = [
    { workerId: "wrk_ai_1", workerCategory: "AiWorker", isBusy: false },
    { workerId: "wrk_rnd_1", workerCategory: "RenderWorker", isBusy: false },
    { workerId: "wrk_exp_1", workerCategory: "ExportWorker", isBusy: false },
  ];

  public updateJobProgress(job: BackgroundJobDescriptor, progressPercent: number): BackgroundJobDescriptor {
    return {
      ...job,
      progressPercent: Math.min(100, Math.max(0, progressPercent)),
      currentState: progressPercent === 100 ? "Completed" : "Running",
      updatedAt: new Date(),
    };
  }

  public cancelJob(job: BackgroundJobDescriptor): BackgroundJobDescriptor {
    return {
      ...job,
      currentState: "Cancelled",
      updatedAt: new Date(),
    };
  }
}
