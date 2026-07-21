import type { StageContext } from "../types.js";

export class MotionBuilder {
  build(context: StageContext): Array<{ sceneIndex: number; motionData: Record<string, unknown> }> {
    const motionTimeline = (context.input.motionTimeline as Record<string, unknown>) ?? {};
    const scenes: Array<{ sceneIndex: number; motionData: Record<string, unknown> }> = [];

    for (const [key, value] of Object.entries(motionTimeline)) {
      const idx = parseInt(key, 10);
      if (!isNaN(idx)) {
        scenes.push({ sceneIndex: idx, motionData: value as Record<string, unknown> });
      }
    }

    return scenes;
  }
}
