import { TimelineProxyConfig } from "./timeline-ui-types";

export interface PreviewMonitorState {
  readonly currentFrame: number;
  readonly isPlaying: boolean;
  readonly safeAreaOverlayVisible: boolean;
  readonly audioLevelMeterDb: number;
  readonly activeResolution: string;
}

/**
 * Live Preview Monitor Controller & Proxy Workflow Engine (Vol 05 Part 11 - Section 13, Section 16).
 * Manages real-time playback, frame stepping, safe area overlays, audio level meters, and high/low-res proxy media switching.
 */
export class LivePreviewProxyEngine {
  private monitorState: PreviewMonitorState = {
    currentFrame: 0,
    isPlaying: false,
    safeAreaOverlayVisible: true,
    audioLevelMeterDb: -18,
    activeResolution: "1080p (Proxy)",
  };

  private proxyConfig: TimelineProxyConfig = {
    isProxyEnabled: true,
    proxyResolution: "1080p",
    isRenderingOriginalQuality: false,
  };

  public togglePlayback(): boolean {
    this.monitorState = { ...this.monitorState, isPlaying: !this.monitorState.isPlaying };
    return this.monitorState.isPlaying;
  }

  public stepFrame(deltaFrames: number): number {
    const newFrame = Math.max(0, this.monitorState.currentFrame + deltaFrames);
    this.monitorState = { ...this.monitorState, currentFrame: newFrame };
    return newFrame;
  }

  public getMonitorState(): Readonly<PreviewMonitorState> {
    return this.monitorState;
  }

  public getProxyConfig(): Readonly<TimelineProxyConfig> {
    return this.proxyConfig;
  }
}
