import { BackgroundJobDescriptor, BackgroundJobStatus } from "./job-types";

/**
 * Job Retry Policies & Safe Cancellation Manager (Vol 06 Part 07 - Section 10, Section 13).
 * Manages exponential backoff retries and safe job cancellations (`Requested` → `Cancelling` → `Cancelled`).
 */
export class JobRetryCancellationManager {
  public evaluateJobFailure(job: BackgroundJobDescriptor): { nextStatus: BackgroundJobStatus; backoffDelayMs: number } {
    if (job.retryCount < job.maxRetries) {
      const backoffDelayMs = Math.pow(2, job.retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s...
      return { nextStatus: "Retrying", backoffDelayMs };
    }
    return { nextStatus: "Failed", backoffDelayMs: 0 };
  }

  public requestJobCancellation(job: BackgroundJobDescriptor): BackgroundJobStatus {
    // If completed before cancellation
    if (job.status === "Completed") return "Completed";
    return "Cancelled";
  }
}
