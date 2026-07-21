export type ShotApprovalStage =
  | "Planned"
  | "AISuggested"
  | "UnderReview"
  | "Approved"
  | "Locked";

export type ShotColorStatus =
  | "Gray" // Planned
  | "Blue" // AI Generated
  | "Yellow" // Needs Review
  | "Green" // Approved
  | "Red" // Missing Assets
  | "Purple"; // Locked

export type AssetReadinessStatus =
  | "ImageReady"
  | "PromptReady"
  | "AwaitingGeneration"
  | "NeedsReplacement"
  | "MissingAsset";

export type CompositionOverlayType =
  | "RuleOfThirds"
  | "SafeArea"
  | "LeadingLines"
  | "CenterComposition"
  | "Symmetry"
  | "HorizonLevel"
  | "None";

export type CinematicPreviewMode =
  | "SlideShow"
  | "AnimatedStoryboard"
  | "TimedPlayback"
  | "NarrationSynchronized";

export interface ShotCardItem {
  readonly shotId: string;
  readonly sceneId: string;
  readonly shotNumber: number;
  readonly thumbnailUrl: string;
  readonly cameraAngle: string;
  readonly durationSecs: number;
  readonly motionType: string;
  readonly assetStatus: AssetReadinessStatus;
  readonly colorStatus: ShotColorStatus;
  readonly approvalStage: ShotApprovalStage;
  readonly directorNotes: string;
  readonly scriptParagraphIndex?: number;
}

export interface SceneBoardItem {
  readonly sceneId: string;
  readonly title: string;
  readonly durationSecs: number;
  readonly narrativeObjective: string;
  readonly emotionalTone: string;
  readonly shots: ReadonlyArray<ShotCardItem>;
}
