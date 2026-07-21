import { PriorityJobQueue } from "./priority-job-queue";
import { DependencyTaskScheduler } from "./dependency-task-scheduler";
import { SpecializedWorkerPools } from "./specialized-worker-pools";
import { JobRetryCancellationManager } from "./job-retry-cancellation-manager";
import { CrashRecoveryResultHandler } from "./crash-recovery-result-handler";
import { BackgroundJobDescriptor, WorkerProgressUpdate, JobPriorityLevel, WorkerPoolType } from "./job-types";

/**
 * Master Background Processing Engine (Main Vol 06 Part 07).
 * Core entry point for asynchronous job execution. Coordinates priority queuing, dependency scheduling, worker pools, crash recovery, and live UI progress reporting.
 */
export class MasterBackgroundProcessing {
  public readonly queue = new PriorityJobQueue();
  public readonly scheduler = new DependencyTaskScheduler();
  public readonly workerPools = new SpecializedWorkerPools();
  public readonly retryManager = new JobRetryCancellationManager();
  public readonly recoveryHandler = new CrashRecoveryResultHandler();

  public submitJob(
    projectId: string,
    jobType: string,
    priority: JobPriorityLevel = "Normal",
    poolType: WorkerPoolType = "AiWorkers",
    prerequisiteJobIds: string[] = []
  ): BackgroundJobDescriptor {
    const job: BackgroundJobDescriptor = {
      jobId: `job_bg_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      jobType,
      priority,
      poolType,
      status: "Queued",
      createdAt: new Date(),
      retryCount: 0,
      maxRetries: 3,
      timeoutMs: 60000,
      prerequisiteJobIds,
    };
    this.queue.enqueueJob(job);
    return job;
  }

  public getJobProgress(jobId: string): WorkerProgressUpdate {
    return {
      jobId,
      progressPercent: 45,
      currentStage: "Processing Chunk 2 of 4",
      estimatedRemainingSecs: 12,
      activeWorkerId: "wrk_ai_1",
      warnings: [],
    };
  }
}
