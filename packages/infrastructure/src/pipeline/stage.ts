/**
 * Base contract for every processing stage in the media pipeline.
 * Each stage: accepts a typed input, produces a typed output, is independently retryable.
 */
export interface PipelineStage<TInput, TOutput> {
  readonly stageName: string;
  execute(input: TInput): Promise<PipelineStageResult<TOutput>>;
}

export type PipelineStageStatus = "Success" | "Failed" | "Skipped";

export interface PipelineStageResult<TOutput> {
  readonly stageName: string;
  readonly status: PipelineStageStatus;
  readonly output?: TOutput;
  readonly error?: string;
  readonly durationMs: number;
}

/**
 * Helper to build a successful stage result.
 */
export function stageSuccess<T>(
  stageName: string,
  output: T,
  durationMs: number
): PipelineStageResult<T> {
  return { stageName, status: "Success", output, durationMs };
}

/**
 * Helper to build a failed stage result.
 */
export function stageFailure<T>(
  stageName: string,
  error: string,
  durationMs: number
): PipelineStageResult<T> {
  return { stageName, status: "Failed", error, durationMs };
}
