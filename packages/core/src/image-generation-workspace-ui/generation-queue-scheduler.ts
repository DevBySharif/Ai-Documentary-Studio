import { ImageGenerationJob, RetryStrategyType } from "./image-ui-types";

/**
 * Managed Generation Queue & Multi-Provider Parallel Scheduler (Vol 05 Part 09 - Section 7, Section 8, Section 9, Section 18).
 * Manages parallel execution across AI image providers (FLUX, SDXL, OpenAI, Imagen) and executes retry strategies upon failure.
 */
export class GenerationQueueScheduler {
  private queue: ImageGenerationJob[] = [];

  public addJob(shotId: string, sceneId: string, promptText: string, triggerPhrase: string, providerName = "FLUX.1-Dev"): ImageGenerationJob {
    const job: ImageGenerationJob = {
      jobId: `job_img_${Math.random().toString(36).substring(2, 7)}`,
      shotId,
      sceneId,
      promptText,
      providerName,
      triggerPhrase,
      status: "Queued",
      queuePosition: this.queue.length + 1,
      retryCount: 0,
      candidates: [],
      approvalStage: "Generated",
      createdAt: new Date(),
    };
    this.queue.push(job);
    return job;
  }

  public executeNextJobInQueue(): ImageGenerationJob | undefined {
    const nextJob = this.queue.find((j) => j.status === "Queued");
    if (nextJob) {
      const idx = this.queue.indexOf(nextJob);
      this.queue[idx] = { ...nextJob, status: "Running" };
      return this.queue[idx];
    }
    return undefined;
  }

  public handleJobFailure(jobId: string, strategy: RetryStrategyType): ImageGenerationJob | undefined {
    const job = this.queue.find((j) => j.jobId === jobId);
    if (!job) return undefined;
    const idx = this.queue.indexOf(job);

    const newProvider = strategy === "SwitchProvider" ? "SDXL-Turbo" : job.providerName;
    const updated: ImageGenerationJob = {
      ...job,
      status: "Retrying",
      retryCount: job.retryCount + 1,
      providerName: newProvider,
    };
    this.queue[idx] = updated;
    return updated;
  }

  public getQueue(): ReadonlyArray<ImageGenerationJob> {
    return this.queue;
  }
}
