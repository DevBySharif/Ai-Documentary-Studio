import { Job, JobType, JobPriority, WorkerCategory, JobEvent } from './types';
import { PriorityQueue } from './priority-queue';
import { JobDependencyResolver } from './job-dependencies';
import { WorkerPool, WorkerInstance } from './worker-pool';
import { CrashRecoveryManager } from './crash-recovery';

export class JobManager {
  private queue = new PriorityQueue();
  private dependencyResolver = new JobDependencyResolver();
  private workerPool = new WorkerPool();
  private crashRecovery = new CrashRecoveryManager();
  
  private eventListeners: Array<(event: JobEvent) => void> = [];
  private processingInterval?: NodeJS.Timeout;

  constructor() {
    this.recoverJobs();
  }

  startProcessing(intervalMs: number = 1000): void {
    if (this.processingInterval) return;
    this.processingInterval = setInterval(() => this.processNextJobs(), intervalMs);
  }

  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = undefined;
    }
  }

  registerWorker(worker: WorkerInstance): void {
    this.workerPool.registerWorker(worker);
  }

  addJob(
    type: JobType,
    priority: JobPriority,
    payload: Record<string, any>,
    dependencies: string[] = []
  ): Job {
    const job: Job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      priority,
      state: "Queued",
      dependencies,
      payload,
      retryCount: 0,
      maxRetries: 3,
      progress: 0,
      history: {
        jobId: "", // Set below
        type,
        retryCount: 0
      }
    };
    job.history.jobId = job.id;

    this.dependencyResolver.addJob(job);
    this.crashRecovery.registerPendingJob(job);
    
    if (this.dependencyResolver.isReady(job.id)) {
      this.queue.enqueue(job);
    }
    
    this.emitEvent(job.id, type, "JobCreated");
    return job;
  }

  pauseJob(jobId: string): void {
    // Check if in queue
    if (this.queue.remove(jobId)) {
      const job = this.crashRecovery.recoverPendingJobs().find(j => j.id === jobId);
      if (job) {
        job.state = "Paused";
        this.emitEvent(job.id, job.type, "JobPaused");
      }
    } else {
      // Might be running, need to cancel execution and mark paused
      this.workerPool.cancelJobExecution(jobId).then(() => {
        const job = this.crashRecovery.recoverPendingJobs().find(j => j.id === jobId);
        if (job) {
          job.state = "Paused";
          this.emitEvent(job.id, job.type, "JobPaused");
        }
      });
    }
  }

  resumeJob(jobId: string): void {
    const job = this.crashRecovery.recoverPendingJobs().find(j => j.id === jobId);
    if (job && job.state === "Paused") {
      job.state = "Queued";
      if (this.dependencyResolver.isReady(job.id)) {
        this.queue.enqueue(job);
      }
      this.emitEvent(job.id, job.type, "JobResumed");
    }
  }

  cancelJob(jobId: string): void {
    this.queue.remove(jobId);
    this.workerPool.cancelJobExecution(jobId).then(() => {
      const job = this.crashRecovery.recoverPendingJobs().find(j => j.id === jobId);
      if (job) {
        job.state = "Cancelled";
        this.crashRecovery.unregisterPendingJob(job.id);
        this.dependencyResolver.removeJob(job.id);
        this.emitEvent(job.id, job.type, "JobCancelled");
      }
    });
  }

  subscribe(listener: (event: JobEvent) => void): void {
    this.eventListeners.push(listener);
  }

  private recoverJobs(): void {
    const recovered = this.crashRecovery.recoverPendingJobs();
    for (const job of recovered) {
      this.dependencyResolver.addJob(job);
      if (job.state === "Queued" && this.dependencyResolver.isReady(job.id)) {
        this.queue.enqueue(job);
      }
    }
  }

  private async processNextJobs(): Promise<void> {
    const jobsToRun = [];
    
    // Peek at the queue and find workers
    while (this.queue.length > 0) {
      const job = this.queue.peek();
      if (!job) break;

      const category = this.mapJobTypeToCategory(job.type);
      const worker = this.workerPool.getAvailableWorker(category);
      
      if (worker) {
        // Dequeue for real
        this.queue.dequeue();
        job.workerId = worker.id;
        jobsToRun.push({ job, workerId: worker.id });
      } else {
        // No available worker for the highest priority job, break and wait for resources
        break;
      }
    }

    for (const { job, workerId } of jobsToRun) {
      this.executeJobOnWorker(job, workerId);
    }
  }

  private async executeJobOnWorker(job: Job, workerId: string): Promise<void> {
    job.state = "Running";
    job.history.startTime = new Date().toISOString();
    this.emitEvent(job.id, job.type, "JobStarted");

    try {
      const result = await this.workerPool.executeOnWorker(workerId, job);
      this.handleJobCompletion(job, result);
    } catch (error: any) {
      this.handleJobFailure(job, error.message || "Unknown error");
    }
  }

  private handleJobCompletion(job: Job, result: any): void {
    job.state = "Completed";
    job.result = result;
    job.progress = 100;
    job.history.finishTime = new Date().toISOString();
    job.history.result = result;

    this.crashRecovery.unregisterPendingJob(job.id);
    
    const newlyReadyJobIds = this.dependencyResolver.markJobCompleted(job.id);
    this.dependencyResolver.removeJob(job.id);

    const recovered = this.crashRecovery.recoverPendingJobs();
    for (const nextJobId of newlyReadyJobIds) {
      const nextJob = recovered.find(j => j.id === nextJobId);
      if (nextJob && nextJob.state === "Queued") {
        this.queue.enqueue(nextJob);
      }
    }

    this.emitEvent(job.id, job.type, "JobCompleted");
  }

  private handleJobFailure(job: Job, error: string): void {
    if (job.retryCount < job.maxRetries) {
      job.retryCount++;
      job.history.retryCount++;
      job.state = "Queued";
      this.queue.enqueue(job); // Enqueue for retry
      // Optionally implement retry delay here
    } else {
      job.state = "Failed";
      job.error = error;
      job.history.finishTime = new Date().toISOString();
      job.history.error = error;
      this.crashRecovery.unregisterPendingJob(job.id);
      this.emitEvent(job.id, job.type, "JobFailed", { error });
    }
  }

  private emitEvent(jobId: string, type: JobType, event: JobEvent["event"], payload?: any): void {
    const jobEvent: JobEvent = {
      jobId,
      type,
      event,
      timestamp: new Date().toISOString(),
      payload
    };
    for (const listener of this.eventListeners) {
      try {
        listener(jobEvent);
      } catch (err) {
        console.error("Error in job event listener", err);
      }
    }
  }

  private mapJobTypeToCategory(type: JobType): WorkerCategory {
    switch (type) {
      case "SceneRendering":
      case "FullVideoRendering":
      case "EffectsProcessing":
        return "GPU";
      case "ScriptGeneration":
      case "PromptGeneration":
      case "QAAnalysis":
        return "AI";
      case "WhisperTranscription":
      case "VoiceGeneration":
      case "TimelineGeneration":
      case "MotionGeneration":
      case "SubtitleGeneration":
      case "ThumbnailGeneration":
      case "ImageGeneration":
        return "CPU";
      case "CacheCleanup":
      case "Export":
        return "IO";
      default:
        return "CPU";
    }
  }
}
