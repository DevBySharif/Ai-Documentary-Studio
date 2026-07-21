import { PublishingChecklistStatus } from "./assistant-types";

/**
 * Publishing Checklist Manager (Vol 04 Part 12 - Section 16).
 * Verifies final render, metadata completeness, thumbnail approval, subtitles, credits, and licensing before release.
 */
export class PublishingChecklistManager {
  public verifyPublishingChecklist(status: Partial<PublishingChecklistStatus>): PublishingChecklistStatus {
    const fullStatus: PublishingChecklistStatus = {
      isRenderAvailable: status.isRenderAvailable || false,
      isMetadataComplete: status.isMetadataComplete || false,
      isThumbnailApproved: status.isThumbnailApproved || false,
      isSubtitlesReady: status.isSubtitlesReady || false,
      isCreditsPresent: status.isCreditsPresent || false,
      isLicensingConfirmed: status.isLicensingConfirmed || false,
      isReviewCompleted: status.isReviewCompleted || false,
      isReadyToPublish: false,
    };

    const isReady =
      fullStatus.isRenderAvailable &&
      fullStatus.isMetadataComplete &&
      fullStatus.isThumbnailApproved &&
      fullStatus.isSubtitlesReady &&
      fullStatus.isLicensingConfirmed &&
      fullStatus.isReviewCompleted;

    return {
      ...fullStatus,
      isReadyToPublish: isReady,
    };
  }
}
