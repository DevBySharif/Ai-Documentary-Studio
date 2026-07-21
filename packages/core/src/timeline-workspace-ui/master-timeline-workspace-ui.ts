import { MultiTrackManager } from "./multi-track-manager";
import { ClipRippleMagneticEngine } from "./clip-ripple-magnetic-engine";
import { MarkerKeyframeEditor } from "./marker-keyframe-editor";
import { LivePreviewProxyEngine } from "./live-preview-proxy-engine";
import { AiEditingAssistantShortcuts } from "./ai-editing-assistant-shortcuts";

/**
 * Master Timeline Workspace UI Engine (Main Vol 05 Part 11).
 * Orchestrates professional timeline layout: Top Toolbar -> Preview Monitor -> Timeline Toolbar -> Multi-Track Canvas -> Clip Inspector -> AI Suggestions/History/Console.
 */
export class MasterTimelineWorkspaceUI {
  public readonly trackManager = new MultiTrackManager();
  public readonly clipEngine = new ClipRippleMagneticEngine();
  public readonly markerKeyframeEditor = new MarkerKeyframeEditor();
  public readonly previewProxyEngine = new LivePreviewProxyEngine();
  public readonly aiAssistantShortcuts = new AiEditingAssistantShortcuts();

  public getMasterRenderFrameCount(): number {
    const tracks = this.trackManager.getTracks();
    let maxFrame = 0;
    tracks.forEach((t) => {
      t.clips.forEach((c) => {
        const end = c.startFrame + c.durationFrames;
        if (end > maxFrame) maxFrame = end;
      });
    });
    return maxFrame || 1440; // Default 60 seconds at 24fps
  }
}
