import type { SelfCritiqueReport } from "./types.js";
import type { StoryScript } from "../story/types.js";
import type { PromptPlan } from "../prompt/types.js";
import type { MotionTimeline } from "../editor/types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";

export class SelfCritiqueEngine {
  critiqueStory(script: StoryScript): SelfCritiqueReport {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 85;

    if (script.scenes.length < 3) {
      issues.push("Too few scenes");
      suggestions.push("Expand the story arc with more scenes");
      score -= 20;
    }

    const hasHook = script.scenes[0]?.purpose === "hook";
    if (!hasHook) {
      issues.push("Missing hook");
      suggestions.push("Add a hook scene at the beginning");
      score -= 15;
    }

    return {
      engine: "Story Engine",
      passed: score >= 70,
      score: Math.max(0, score),
      issues,
      suggestions,
    };
  }

  critiquePrompts(plan: PromptPlan): SelfCritiqueReport {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 85;

    if (plan.scenePrompts.length === 0) {
      issues.push("No prompts generated");
      suggestions.push("Run prompt generation first");
      score -= 30;
    }

    const shortPrompts = plan.scenePrompts.filter((p) => p.prompt.length < 30);
    if (shortPrompts.length > 0) {
      issues.push(`${shortPrompts.length} prompts too short`);
      suggestions.push("Add more detail to short prompts");
      score -= 10;
    }

    return {
      engine: "Prompt Intelligence Engine",
      passed: score >= 70,
      score: Math.max(0, score),
      issues,
      suggestions,
    };
  }

  critiqueMotion(timeline: MotionTimeline): SelfCritiqueReport {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 85;

    if (timeline.clips.length === 0) {
      issues.push("No motion clips");
      suggestions.push("Generate motion timeline");
      score -= 30;
    }

    const onlyHolds = timeline.clips.every((c) => c.motion === "hold");
    if (onlyHolds) {
      issues.push("All clips are static holds");
      suggestions.push("Add variety: push-ins, pans, or zooms");
      score -= 15;
    }

    return {
      engine: "Cinematic Motion Engine",
      passed: score >= 70,
      score: Math.max(0, score),
      issues,
      suggestions,
    };
  }

  critiqueAudio(audio: AudioIntelligenceResult): SelfCritiqueReport {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 85;

    if (!audio.quality.passed) {
      issues.push("Audio quality below threshold");
      suggestions.push("Check audio source or regenerate narration");
      score -= 20;
    }

    if (audio.whisper.words.length < 10) {
      issues.push("Very few words transcribed");
      suggestions.push("Check audio clarity or volume");
      score -= 15;
    }

    return {
      engine: "Audio Intelligence System",
      passed: score >= 70,
      score: Math.max(0, score),
      issues,
      suggestions,
    };
  }
}
