import { NarrationApprovalStage } from "./voice-ui-types";

export interface NarrationTimelineSegment {
  readonly segmentId: string;
  readonly scriptParagraphIndex: number;
  readonly startTimeSecs: number;
  readonly endTimeSecs: number;
  readonly narrationAudioUrl: string;
  readonly approvalStage: NarrationApprovalStage;
}

/**
 * Narration Timeline Sync & Approval Engine (Vol 05 Part 10 - Section 14, Section 17).
 * Synchronizes audio segments with script paragraphs and storyboard shots, and controls approval stage progression.
 */
export class NarrationTimelineApproval {
  private segments: NarrationTimelineSegment[] = [
    {
      segmentId: "seg_1",
      scriptParagraphIndex: 0,
      startTimeSecs: 0.0,
      endTimeSecs: 14.5,
      narrationAudioUrl: "d:/Youtube/Ai Documentary Studio/voice/seg_1.wav",
      approvalStage: "Approved",
    },
  ];

  public promoteApprovalStage(current: NarrationApprovalStage): NarrationApprovalStage {
    const order: NarrationApprovalStage[] = ["Draft", "AIReviewed", "HumanReviewed", "Approved", "Locked"];
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) {
      return order[idx + 1];
    }
    return current;
  }

  public getTimelineSegments(): ReadonlyArray<NarrationTimelineSegment> {
    return this.segments;
  }
}
