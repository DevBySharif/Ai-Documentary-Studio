import type { StageContext, RenderScene } from "../types.js";

export class SceneBuilder {
  build(context: StageContext): RenderScene[] {
    const scenes: RenderScene[] = [];
    const images: string[] = (context.input.approvedImages as string[]) ?? [];
    const subtitles: Array<{ text: string; startFrame: number; endFrame: number }> = ((context.input.subtitleTimeline as Array<{ text: string; startFrame: number; endFrame: number }>) ?? []);
    const sceneCount = Math.max(images.length, 1);

    for (let i = 0; i < sceneCount; i++) {
      const image = images[i] ?? images[images.length - 1] ?? "";
      const subtitleEvents = subtitles
        .filter((s) => s.startFrame >= i * 100 && s.endFrame <= (i + 1) * 100)
        .map((s) => ({ startFrame: s.startFrame, endFrame: s.endFrame, text: s.text, isHighlighted: false, isKeyword: false }));

      scenes.push({
        sceneIndex: i,
        image,
        motionPlan: {},
        cameraPath: {},
        effects: [],
        subtitleEvents,
        timing: {
          startFrame: i * 100,
          endFrame: (i + 1) * 100,
          holdFrames: 80,
          transitionFrames: 20
        }
      });
    }

    return scenes;
  }
}
