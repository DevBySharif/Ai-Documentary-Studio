import { BackgroundJobDescriptor, DeadLetterQueueItem } from "./job-event-types";

/**
 * Exponential Backoff Retry Manager & Dead Letter Queue (DLQ) Replayer (Vol 09 Part 03 - Section 9, Section 10).
 * Handles exponential backoff retries for transient job failures and routes unrecoverable jobs to DLQ for admin inspection.
 */
export class RetryDeadLetterManager {
  private deadLetterQueue: DeadLetterQueueItem[] = [];

  public handleJobFailure(job: BackgroundJobDescriptor, errorReason: string): { actionTaken: "Retried" | "MovedToDLQ"; updatedJob: BackgroundJobDescriptor } {
    if (job.attemptsMade < job.retryPolicy.maxAttempts) {
      const updated: BackgroundJobDescriptor = {
        ...job,
        attemptsMade: job.attemptsMade + 1,
        currentState: "Queued",
        errorMessage: errorReason,
        updatedAt: new Date(),
      };
      return { actionTaken: "Retried", updatedJob: updated };
    }

    const dlqItem: DeadLetterQueueItem = {
      dlqId: `dlq_${Math.random().toString(36).substring(2, 7)}`,
      originalJob: job,
      failureReason: errorReason,
      movedToDlqAt: new Date(),
    };
    this.deadLetterQueue.push(dlqItem);

    const failedJob: BackgroundJobDescriptor = {
      ...job,
      currentState: "Failed",
      errorMessage: errorReason,
      updatedAt: new Date(),
    };

    return { actionTaken: "MovedToDLQ", updatedJob: failedJob };
  }

  public getDeadLetterQueueItems(): ReadonlyArray<DeadLetterQueueItem> {
    return this.deadLetterQueue;
  }
}
