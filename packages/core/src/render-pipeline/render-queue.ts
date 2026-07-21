import { RenderJob, RenderJobState } from "./render-job-model";

/**
 * Render Queue System (IB Part 21 - Section 14).
 * Priority ordering, pause, resume, retry, cancellation.
 */
export class RenderQueue {
  private queue: RenderJob[] = [];

  public enqueue(job: RenderJob): void {
    this.queue.push(job);
    this.sortQueue();
  }

  public dequeue(): RenderJob | undefined {
    return this.queue.find((j) => j.state === "Queued");
  }

  public updateJobState(jobId: string, state: RenderJobState, renderedFrames = 0, error?: string): void {
    const job = this.queue.find((j) => j.jobId === jobId);
    if (!job) return;

    job.state = state;
    job.renderedFrames = renderedFrames;
    if (error) job.error = error;
    if (state === "Completed" || state === "Failed") {
      job.completedAt = new Date();
    }
  }

  public cancelJob(jobId: string): boolean {
    const job = this.queue.find((j) => j.jobId === jobId);
    if (job) {
      job.state = "Cancelled";
      return true;
    }
    return false;
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  public listJobs(): ReadonlyArray<RenderJob> {
    return this.queue;
  }
}
