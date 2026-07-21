export type ExecutionStrategyType = "Sequential" | "Parallel" | "Hybrid" | "HumanInTheLoop";

export type TaskCategoryType =
  | "Research"
  | "Writing"
  | "VisualGeneration"
  | "AudioGeneration"
  | "Editing"
  | "Verification"
  | "Review"
  | "Rendering";

export interface DecomposedTaskItem {
  readonly taskId: string;
  readonly taskName: string;
  readonly category: TaskCategoryType;
  readonly capabilityRequired: string;
  readonly prerequisiteTaskIds: ReadonlyArray<string>;
  readonly isParallelizable: boolean;
  readonly requiresHumanApprovalGate: boolean;
}

export interface ResourceEstimates {
  readonly expectedAiRequestsCount: number;
  readonly estimatedTokensCount: number;
  readonly estimatedImageGenerationsCount: number;
  readonly estimatedVoiceSecs: number;
  readonly estimatedGpuWorkloadMinutes: number;
  readonly estimatedCostUSD: number;
  readonly estimatedCompletionMins: number;
}

export interface ExecutionPlanDescriptor {
  readonly planId: string;
  readonly projectId: string;
  readonly planVersion: number;
  readonly primaryGoal: string;
  readonly strategy: ExecutionStrategyType;
  readonly tasks: ReadonlyArray<DecomposedTaskItem>;
  readonly estimates: ResourceEstimates;
  readonly decisionRationale: ReadonlyArray<string>;
  readonly createdAt: Date;
  readonly status: "Draft" | "Approved" | "Executing" | "Completed" | "Replanned";
}
