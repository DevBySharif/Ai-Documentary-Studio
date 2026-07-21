export type PublishingPlatform =
  | "YouTube"
  | "Facebook"
  | "TikTok"
  | "Instagram"
  | "X"
  | "LinkedIn";

export type RepurposedFormat =
  | "Shorts"
  | "Reels"
  | "Clips"
  | "EducationalSnippet"
  | "SocialPost"
  | "BlogSummary"
  | "PromotionalTrailer";

export interface ThumbnailConcept {
  readonly conceptId: string;
  readonly visualPrompt: string;
  readonly textOverlay: string;
  readonly framingStyle: string;
  readonly colorEmphasis: string;
}

export interface TitleOption {
  readonly title: string;
  readonly style: "Curiosity" | "EducationalClarity" | "SearchIntent" | "DocumentaryStyle" | "SeriesConsistency";
  readonly predictedCTRScore: number;
}

export interface ChapterMarker {
  readonly startTimeSecs: number;
  readonly title: string;
  readonly description: string;
}

export interface PublishingChecklistStatus {
  readonly isRenderAvailable: boolean;
  readonly isMetadataComplete: boolean;
  readonly isThumbnailApproved: boolean;
  readonly isSubtitlesReady: boolean;
  readonly isCreditsPresent: boolean;
  readonly isLicensingConfirmed: boolean;
  readonly isReviewCompleted: boolean;
  readonly isReadyToPublish: boolean;
}

export interface PostPubAnalytics {
  readonly projectId: string;
  readonly viewCount: number;
  readonly averageRetentionPercent: number;
  readonly clickThroughRatePercent: number;
  readonly userFeedbackRating: number;
  readonly recordedAt: Date;
}
