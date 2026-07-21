import type { RenderScene, ConstructedFrame } from "../types.js";

export class FrameBuilder {
  construct(scenes: RenderScene[], totalFrames: number): ConstructedFrame[] {
    const frames: ConstructedFrame[] = [];

    for (let frame = 0; frame < totalFrames; frame++) {
      const scene = scenes.find((s) => frame >= s.timing.startFrame && frame < s.timing.endFrame);
      if (!scene) continue;

      const progress = (frame - scene.timing.startFrame) / (scene.timing.endFrame - scene.timing.startFrame);
      const activeSubtitles = scene.subtitleEvents.filter((s) => frame >= s.startFrame && frame < s.endFrame);

      frames.push({
        frameIndex: frame,
        sceneIndex: scene.sceneIndex,
        image: scene.image,
        cameraTransform: { zoom: 1 + progress * 0.05, panX: 0, panY: 0 },
        effects: scene.effects,
        subtitles: activeSubtitles.map((s) => ({
          text: s.text,
          position: { x: 960, y: 1000 }
        }))
      });
    }

    return frames;
  }
}
