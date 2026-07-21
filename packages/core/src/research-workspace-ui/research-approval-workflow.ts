import { ResearchApprovalStage } from "./research-ui-types";

export interface ResearchDiscoveryEvent {
  readonly eventId: string;
  readonly title: string;
  readonly timestamp: Date;
  readonly category: "SourceAdded" | "EvidenceDiscovered" | "SummaryGenerated" | "VerificationCompleted";
}

/**
 * Research Approval Workflow & Discovery Timeline (Vol 05 Part 04 - Section 12, Section 16).
 * Controls approval progression (Collected -> Reviewed -> Verified -> Approved -> Archived) and discovery timeline.
 */
export class ResearchApprovalWorkflow {
  private discoveryEvents: ResearchDiscoveryEvent[] = [
    {
      eventId: "disc_1",
      title: "Archival paper 'doc1845.pdf' added to research pool",
      timestamp: new Date("2026-07-21T17:00:00Z"),
      category: "SourceAdded",
    },
  ];

  public updateApprovalStage(currentStage: ResearchApprovalStage, targetStage: ResearchApprovalStage): ResearchApprovalStage {
    const validTransitions: Record<ResearchApprovalStage, ResearchApprovalStage[]> = {
      Collected: ["Reviewed"],
      Reviewed: ["Verified"],
      Verified: ["Approved"],
      Approved: ["Archived"],
      Archived: ["Approved"],
    };

    if (validTransitions[currentStage]?.includes(targetStage)) {
      return targetStage;
    }
    return currentStage;
  }

  public getDiscoveryTimeline(): ReadonlyArray<ResearchDiscoveryEvent> {
    return this.discoveryEvents;
  }
}
