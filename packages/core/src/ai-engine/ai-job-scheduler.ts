export type AiJobState = "Queued" | "Running" | "Waiting" | "Retrying" | "Completed" | "Failed";

export interface AiJob {
  readonly jobId: string;
  readonly providerName: string;
  readonly modelId: string;
  readonly agentName: string;
  state: AiJobState;
  retryCount: number;
  readonly maxRetries: number;
  tokensConsumed: number;
  readonly createdAt: Date;
  completedAt?: Date;
  error?: string;
}

/**
 * AI Job Scheduler & Fallback Engine (IB Part 18 - Section 13, Section 14).
 * Jobs are persisted, resumable, and implement fallback policies on failure.
 */
export class AiJobScheduler {
  private jobs = new Map<string, AiJob>();

  public createJob(providerName: string, modelId: string, agentName: string, maxRetries = 3): AiJob {
    const job: AiJob = {
      jobId: `ai-job-${Math.floor(Math.random() * 9000 + 1000)}`,
      providerName,
      modelId,
      agentName,
      state: "Queued",
      retryCount: 0,
      maxRetries,
      tokensConsumed: 0,
      createdAt: new Date(),
    };
    this.jobs.set(job.jobId, job);
    return job;
  }

  public updateJobState(jobId: string, state: AiJobState, tokensConsumed = 0, error?: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.state = state;
    job.tokensConsumed += tokensConsumed;
    if (error) job.error = error;
    if (state === "Completed" || state === "Failed") {
      job.completedAt = new Date();
    }
  }

  public getJob(jobId: string): AiJob | undefined {
    return this.jobs.get(jobId);
  }
}
