import { ImageApprovalStage, ImageGenerationJob } from "./image-ui-types";

export interface DownstreamAutoLinks {
  readonly storyboardShotId: string;
  readonly timelineClipId: string;
  readonly assetManagerId: string;
}

/**
 * Image Approval Workflow & Downstream Asset Auto-Linker (Vol 05 Part 09 - Section 14, Section 17).
 * Controls approval progression (Generated -> AIReviewed -> HumanReviewed -> Approved -> Locked) and auto-links approved images to Storyboard, Timeline, and Asset Manager.
 */
export class ImageApprovalAutolinker {
  public promoteApprovalStage(current: ImageApprovalStage): ImageApprovalStage {
    const order: ImageApprovalStage[] = ["Generated", "AIReviewed", "HumanReviewed", "Approved", "Locked"];
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) {
      return order[idx + 1];
    }
    return current;
  }

  public autoLinkApprovedAsset(job: ImageGenerationJob, approvedCandidateUrl: string): DownstreamAutoLinks {
    return {
      storyboardShotId: job.shotId,
      timelineClipId: `clip_${job.shotId}`,
      assetManagerId: `ast_img_${job.jobId}`,
    };
  }
}
