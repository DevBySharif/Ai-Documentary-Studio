import { ProductionPhase, QualityGateStatus } from "./director-types";

export interface ApprovalCheckpointResult {
  readonly phase: ProductionPhase;
  readonly isApprovedByHuman: boolean;
  readonly gateStatus: QualityGateStatus;
  readonly feedbackNotes?: string;
}

/**
 * Quality Gate & Human Checkpoint Manager (Vol 04 Part 10 - Section 9, Section 10).
 * Verifies quality gate standards before phase advancement and manages mandatory human approval checkpoints.
 */
export class QualityGateManager {
  private checkpoints = new Map<ProductionPhase, boolean>();

  constructor() {
    this.initDefaultCheckpoints();
  }

  private initDefaultCheckpoints(): void {
    const mandatory: ProductionPhase[] = ["Research", "Writing", "Storyboard", "TimelineComposition", "Approval"];
    mandatory.forEach((p) => this.checkpoints.set(p, true));
  }

  public verifyQualityGate(phase: ProductionPhase, completenessScore: number): QualityGateStatus {
    if (completenessScore >= 90) return "Passed";
    if (completenessScore >= 75) return "Degraded";
    return "Failed";
  }

  public isCheckpointMandatory(phase: ProductionPhase): boolean {
    return this.checkpoints.get(phase) || false;
  }
}
