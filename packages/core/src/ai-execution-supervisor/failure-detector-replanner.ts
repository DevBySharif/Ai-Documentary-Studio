export interface FailureClassification {
  readonly category: "ProviderFailure" | "Timeout" | "InvalidAiResponse" | "MissingOutput" | "ResourceExhaustion" | "ValidationFailure";
  readonly message: string;
  readonly isReplanningRequired: boolean;
}

/**
 * Failure Detector & Adaptive Replanner (Vol 07 Part 04 - Section 9, Section 10).
 * Detects runtime failures, classifies errors, and triggers adaptive replanning for unfinished tasks.
 */
export class FailureDetectorReplanner {
  public classifyFailure(errorMessage: string): FailureClassification {
    const isTimeout = errorMessage.toLowerCase().includes("timeout");
    const isProvider = errorMessage.toLowerCase().includes("provider") || errorMessage.toLowerCase().includes("500");

    return {
      category: isTimeout ? "Timeout" : isProvider ? "ProviderFailure" : "ValidationFailure",
      message: errorMessage,
      isReplanningRequired: isProvider,
    };
  }
}
