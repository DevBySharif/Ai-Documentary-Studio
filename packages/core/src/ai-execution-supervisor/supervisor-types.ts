export type SupervisorTaskStatus =
  | "Pending"
  | "Ready"
  | "Running"
  | "Paused"
  | "WaitingApproval"
  | "Completed"
  | "Failed"
  | "Cancelled";

export interface SupervisorTaskState {
  readonly taskId: string;
  readonly taskName: string;
  readonly status: SupervisorTaskStatus;
  readonly progressPercent: number;
  readonly activeWorkerId?: string;
  readonly failureReason?: string;
  readonly isApproved: boolean;
}

export interface RuntimeCheckpoint {
  readonly checkpointId: string;
  readonly planId: string;
  readonly completedTaskIds: ReadonlyArray<string>;
  readonly activeTaskIds: ReadonlyArray<string>;
  readonly pendingTaskIds: ReadonlyArray<string>;
  readonly timestamp: Date;
}

export interface LiveStatusModel {
  readonly currentPhase: string;
  readonly runningTaskName: string;
  readonly estimatedRemainingMins: number;
  readonly activeWorker: string;
  readonly aiProviderInUse: string;
  readonly overallSuccessRatePercent: number;
}
