import type { RenderPackage, RenderConfig } from "./types.js";
import type { StoryScript } from "../story/types.js";
import type { PromptPlan } from "../prompt/types.js";
import type { MotionTimeline } from "../editor/types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";

export class RenderPackageBuilder {
  build(
    projectId: string,
    script: StoryScript,
    promptPlan: PromptPlan,
    audio: AudioIntelligenceResult,
    motionTimeline: MotionTimeline,
    qualityScore: number
  ): RenderPackage {
    const subtitles = audio.subtitles.map((s) => ({
      start: s.start,
      end: s.end,
      text: s.text,
      highlighted: s.highlightedWords ?? [],
    }));

    const imageUrls: RenderPackage["imageUrls"] = [];

    return {
      projectId,
      script,
      promptPlan,
      audio,
      motionTimeline,
      subtitles,
      imageUrls,
      metadata: {
        totalDuration: script.totalDuration,
        imageCount: promptPlan.scenePrompts.length,
        sceneCount: script.scenes.length,
        qualityScore,
        createdAt: new Date().toISOString(),
      },
      sealed: false,
    };
  }

  seal(pkg: RenderPackage): RenderPackage {
    return { ...pkg, sealed: true };
  }

  getDefaultConfig(): RenderConfig {
    return {
      fps: 30,
      resolution: { width: 1920, height: 1080 },
      codec: "h264",
      outputFormat: "mp4",
    };
  }
}
