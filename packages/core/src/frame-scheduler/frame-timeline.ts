import type { FMFrameState, FSCameraState, FSSubtitleState, FSEffectState, FSAudioState } from "./types.js";

export class FMFrameTimelineGenerator {
  generateFrame(frameNumber: number, timestampMs: number, scene: string): FMFrameState {
    return {
      frameNumber,
      timestampMs,
      scene,
      camera: this.defaultCamera(),
      subtitle: this.defaultSubtitle(),
      effect: this.defaultEffect(),
      audio: this.defaultAudio()
    };
  }

  private defaultCamera(): FSCameraState {
    return { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, zoom: 1, parallax: 0 };
  }

  private defaultSubtitle(): FSSubtitleState {
    return { active: false, text: "", highlightedWord: null, animation: "none", opacity: 0 };
  }

  private defaultEffect(): FSEffectState {
    return { active: new Map(), transitions: [] };
  }

  private defaultAudio(): FSAudioState {
    return { position: 0, speaking: false, ducking: 0 };
  }

  isFrameValid(frame: FMFrameState): boolean {
    return frame.frameNumber >= 0 && frame.timestampMs >= 0;
  }
}
