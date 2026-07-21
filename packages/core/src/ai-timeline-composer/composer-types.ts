export type SyncLevel =
  | "ParagraphLevel"
  | "SceneLevel"
  | "SentenceLevel"
  | "PhraseLevel"
  | "WordLevel";

export type WordTriggerType =
  | "ImageChange"
  | "HighlightAnimation"
  | "MapReveal"
  | "CharacterAppearance"
  | "DiagramOverlay"
  | "ArchivePhotograph"
  | "TimelineMarker";

export type MotionAssignment =
  | "SlowZoomIn"
  | "SlowZoomOut"
  | "PanLeft"
  | "PanRight"
  | "Tilt"
  | "Parallax"
  | "FocusShift"
  | "NoMovement";

export type TransitionType =
  | "HardCut"
  | "Fade"
  | "Dissolve"
  | "MatchCut"
  | "JCut"
  | "LCut"
  | "GraphicMatch";

export type TimelineLayerRole =
  | "BackgroundVisuals"
  | "ForegroundElements"
  | "Titles"
  | "Subtitles"
  | "Maps"
  | "Charts"
  | "Overlays"
  | "Effects";

export interface ComposedClip {
  readonly clipId: string;
  readonly assetId: string;
  readonly layerRole: TimelineLayerRole;
  readonly trackIndex: number;
  readonly startFrame: number;
  readonly durationFrames: number;
  readonly motion: MotionAssignment;
  readonly transitionIn: TransitionType;
  readonly triggerType?: WordTriggerType;
  readonly isUserLocked: boolean;
}

export interface ComposedTimeline {
  readonly timelineId: string;
  readonly fps: number;
  readonly totalFrames: number;
  readonly totalDurationSecs: number;
  readonly clips: ReadonlyArray<ComposedClip>;
  readonly syncLevelUsed: SyncLevel;
}

export interface TimelineQualityReport {
  readonly narrativeFlowScore: number; // 0 to 100
  readonly syncAccuracyScore: number;
  readonly visualDiversityScore: number;
  readonly motionBalanceScore: number;
  readonly transitionQualityScore: number;
  readonly viewerFatigueRiskScore: number; // Lower is better
  readonly emptyRegionsCount: number;
  readonly suggestions: ReadonlyArray<string>;
}
