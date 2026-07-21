import { ImportJob } from "./import-job";

type JobCallback = (job: ImportJob) => void;

/**
 * Resource-aware, prioritized processing queue.
 * Supports configurable concurrency, pause/resume, and cancellation.
 */
export class ProcessingQueue {
  private queue: ImportJob[] = [];
  private activeCount = 0;
  private isPaused = false;
  private readonly onCompleteCallbacks = new Set<JobCallback>();
  private readonly onFailureCallbacks = new Set<JobCallback>();

  constructor(private readonly maxConcurrency: number = 2) {}

  public enqueue(job: ImportJob): void {
    this.queue.push(job);
    // Sort by descending priority (higher number = higher priority)
    this.queue.sort((a, b) => b.priority - a.priority);
    this.tick();
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
    this.tick();
  }

  public cancel(jobId: string): boolean {
    const idx = this.queue.findIndex(j => j.id === jobId);
    if (idx !== -1) {
      this.queue.splice(idx, 1);
      return true;
    }
    return false;
  }

  public onComplete(callback: JobCallback): () => void {
    this.onCompleteCallbacks.add(callback);
    return () => this.onCompleteCallbacks.delete(callback);
  }

  public onFailure(callback: JobCallback): () => void {
    this.onFailureCallbacks.add(callback);
    return () => this.onFailureCallbacks.delete(callback);
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public getActiveCount(): number {
    return this.activeCount;
  }

  private tick(): void {
    if (this.isPaused) return;

    while (this.activeCount < this.maxConcurrency && this.queue.length > 0) {
      const job = this.queue.shift();
      if (!job) break;
      this.processJob(job);
    }
  }

  private processJob(job: ImportJob): void {
    this.activeCount++;
    // Actual processing is delegated to the AssetPipeline.
    // The queue signals readiness and tracks concurrency only.
    Promise.resolve(job)
      .then(completedJob => {
        completedJob.status = "Completed";
        completedJob.completedAt = new Date();
        this.onCompleteCallbacks.forEach(cb => cb(completedJob));
      })
      .catch(() => {
        job.status = "Failed";
        this.onFailureCallbacks.forEach(cb => cb(job));
      })
      .finally(() => {
        this.activeCount--;
        this.tick();
      });
  }
}
