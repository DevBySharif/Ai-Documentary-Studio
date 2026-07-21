import type { ProjectManifest } from "./types.js";
import type { StoryScript } from "../story/types.js";
import type { PromptPlan } from "../prompt/types.js";

export class ManifestGenerator {
  generate(
    projectId: string,
    channelDna: string,
    script: StoryScript,
    promptPlan: PromptPlan,
    voice: string,
    qualityScore: number,
    warnings: string[],
    status: string = "Approved"
  ): ProjectManifest {
    const total = promptPlan.scenePrompts.length;
    const reused = promptPlan.scenePrompts.filter((p) => p.reuse).length;
    const reuseRate = total > 0 ? Math.round((reused / total) * 100) : 0;

    return {
      projectId,
      channelDna,
      runtime: script.totalDuration,
      sceneCount: script.scenes.length,
      imageCount: total,
      reuseRate,
      voice,
      status,
      qualityScore,
      createdAt: new Date().toISOString(),
      engines: [
        "Research", "ChannelDNA", "ProjectDNA", "NarrativePlanner",
        "StoryEngine", "VisualStoryboard", "PromptIntelligence",
        "MemoryManager", "AudioIntelligence", "Whisper",
        "TimelineEngine", "MotionEngine", "QualityEngine",
      ],
      warnings,
    };
  }
}
