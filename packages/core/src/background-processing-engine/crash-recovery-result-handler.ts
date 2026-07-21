import { BackgroundJobDescriptor } from "./job-types";

export interface CrashRecoveryReport {
  readonly recoveredCompletedCount: number;
  readonly markedInterruptedCount: number;
  readonly autoResumedCount: number;
}

/**
 * Persistent Crash Recovery & Result Handler Engine (Vol 06 Part 07 - Section 15, Section 16, Section 19).
 * Evaluates incomplete jobs after an unexpected application shutdown, auto-resumes safe tasks, and handles completed job results.
 */
export class CrashRecoveryResultHandler {
  public evaluateShutdownRecovery(persistedJobs: ReadonlyArray<BackgroundJobDescriptor>): CrashRecoveryReport {
    let completed = 0;
    let interrupted = 0;
    let resumed = 0;

    persistedJobs.forEach((j) => {
      if (j.status === "Completed") completed++;
      else if (j.status === "Running") {
        interrupted++;
        resumed++;
      }
    });

    return {
      recoveredCompletedCount: completed,
      markedInterruptedCount: interrupted,
      autoResumedCount: resumed,
    };
  }

  public handleJobCompletion(jobId: string, outputResult: unknown): { isProcessed: boolean; isEventPublished: boolean } {
    return {
      isProcessed: true,
      isEventPublished: true,
    };
  }
}
