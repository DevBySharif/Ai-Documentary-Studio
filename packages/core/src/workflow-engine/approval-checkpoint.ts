export type ApprovalDecision = "Approved" | "Rejected" | "RequestRegeneration";

export interface ApprovalRequest {
  readonly checkpointId: string;
  readonly taskId: string;
  readonly checkpointName: string;
  readonly summary: string;
  readonly requestedAt: Date;
}

export interface ApprovalRecord {
  readonly checkpointId: string;
  readonly decision: ApprovalDecision;
  readonly reviewerComment?: string;
  readonly decidedAt: Date;
}

/**
 * Human-in-the-Loop Checkpoints (IB Part 20 - Section 10, Section 22).
 * Approval is a first-class concept that pauses downstream execution safely.
 */
export class ApprovalCheckpointManager {
  private activeRequests = new Map<string, ApprovalRequest>();
  private records = new Map<string, ApprovalRecord>();

  public createCheckpoint(taskId: string, checkpointName: string, summary: string): ApprovalRequest {
    const request: ApprovalRequest = {
      checkpointId: `chk_${Math.random().toString(36).substring(2, 9)}`,
      taskId,
      checkpointName,
      summary,
      requestedAt: new Date(),
    };
    this.activeRequests.set(request.checkpointId, request);
    return request;
  }

  public submitDecision(checkpointId: string, decision: ApprovalDecision, comment?: string): ApprovalRecord {
    const record: ApprovalRecord = {
      checkpointId,
      decision,
      reviewerComment: comment,
      decidedAt: new Date(),
    };
    this.records.set(checkpointId, record);
    this.activeRequests.delete(checkpointId);
    return record;
  }

  public getPendingRequests(): ReadonlyArray<ApprovalRequest> {
    return Array.from(this.activeRequests.values());
  }

  public getRecord(checkpointId: string): ApprovalRecord | undefined {
    return this.records.get(checkpointId);
  }
}
