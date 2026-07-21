export type TrackType =
  | "Video"
  | "Images"
  | "Narration"
  | "Music"
  | "SoundEffects"
  | "AmbientAudio"
  | "Titles"
  | "Subtitles"
  | "Graphics"
  | "Overlays"
  | "Markers";

export type EditingMode = "Standard" | "Ripple" | "Magnetic";

export interface KeyframePoint {
  readonly framePosition: number;
  readonly value: number;
  readonly easing: "Linear" | "EaseIn" | "EaseOut" | "EaseInOut";
}

export interface KeyframeTrack {
  readonly propertyName: "PositionX" | "PositionY" | "Scale" | "Rotation" | "Opacity" | "Blur" | "Volume";
  readonly points: ReadonlyArray<KeyframePoint>;
}

export interface NleMarkerItem {
  readonly markerId: string;
  readonly framePosition: number;
  readonly category: "SceneBoundary" | "NarrationCue" | "MusicCue" | "ReviewNote" | "Todo" | "ExportRegion";
  readonly title: string;
  readonly colorHex: string;
}

export interface NleClipItem {
  readonly clipId: string;
  readonly trackId: string;
  readonly assetId: string;
  readonly startFrame: number;
  readonly durationFrames: number;
  readonly playbackSpeed: number; // e.g. 1.0
  readonly isLocked: boolean;
  readonly isApproved: boolean;
  readonly keyframes: ReadonlyArray<KeyframeTrack>;
  readonly linkedNarrationSegmentId?: string;
}

export interface NleTrackDescriptor {
  readonly trackId: string;
  readonly trackName: string;
  readonly trackType: TrackType;
  readonly isLocked: boolean;
  readonly isMuted: boolean;
  readonly isSolo: boolean;
  readonly isCollapsed: boolean;
  readonly colorHex: string;
  readonly clips: ReadonlyArray<NleClipItem>;
}

export interface TimelineProxyConfig {
  readonly isProxyEnabled: boolean;
  readonly proxyResolution: "720p" | "1080p";
  readonly isRenderingOriginalQuality: boolean;
}
