export type CameraAngle =
  | "WideShot"
  | "MediumShot"
  | "CloseUp"
  | "ExtremeCloseUp"
  | "AerialView"
  | "TopView"
  | "POV"
  | "TrackingShot"
  | "StaticComposition"
  | "SlowPushIn"
  | "PullOut";

export type CompositionRule =
  | "RuleOfThirds"
  | "LeadingLines"
  | "Symmetry"
  | "Framing"
  | "NegativeSpace"
  | "DepthLayering"
  | "ForegroundInterest";

export type VisualSourceType =
  | "ArchivalFootage"
  | "HistoricalPhotograph"
  | "Map"
  | "Chart"
  | "Document"
  | "StockVideo"
  | "AiGeneratedImage"
  | "MotionGraphics"
  | "ScreenRecording";

export type MotionType =
  | "SlowZoom"
  | "Pan"
  | "Tilt"
  | "Parallax"
  | "KenBurns"
  | "CameraDrift"
  | "ObjectTracking"
  | "NoMotion";

export interface ImageGenPlan {
  readonly subject: string;
  readonly environment: string;
  readonly timePeriod: string;
  readonly mood: string;
  readonly cameraAngle: CameraAngle;
  readonly composition: CompositionRule;
  readonly visualStyle: string;
  readonly historicalConstraints: ReadonlyArray<string>;
}

export interface ShotPlan {
  readonly shotNumber: number;
  readonly shotObjective: string;
  readonly rationale: string; // "Why should the audience see this?"
  readonly minDurationSecs: number;
  readonly recommendedDurationSecs: number;
  readonly maxDurationSecs: number;
  readonly visualSource: VisualSourceType;
  readonly camera: CameraAngle;
  readonly composition: CompositionRule;
  readonly motion: MotionType;
  readonly transitionSuggestion: string;
  readonly imageGenPlan?: ImageGenPlan;
}

export interface StoryboardScene {
  readonly sceneId: string;
  readonly sceneIndex: number;
  readonly narrativePurpose: string;
  readonly emotionalIntent: string;
  readonly shots: ReadonlyArray<ShotPlan>;
  readonly directorsNotes?: ReadonlyArray<string>;
  readonly totalDurationSecs: number;
}
