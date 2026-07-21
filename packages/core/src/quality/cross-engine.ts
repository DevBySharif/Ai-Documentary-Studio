import type { CrossEngineIssue } from "./types.js";
import type { StoryScript } from "../story/types.js";
import type { PromptPlan } from "../prompt/types.js";
import type { MotionTimeline } from "../editor/types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";

export class CrossEngineValidator {
  validateStoryPrompt(script: StoryScript, promptPlan: PromptPlan): CrossEngineIssue[] {
    const issues: CrossEngineIssue[] = [];

    const sceneCount = script.scenes.length;
    const promptCount = promptPlan.scenePrompts.length;

    if (sceneCount !== promptCount) {
      issues.push({
        engines: ["Story Engine", "Prompt Intelligence Engine"],
        description: `Scene count mismatch: story=${sceneCount}, prompts=${promptCount}`,
        severity: sceneCount > promptCount ? "high" : "medium",
        recommendedAction: promptCount < sceneCount
          ? "Generate missing prompts for all scenes"
          : "Remove extra prompts or add scenes",
      });
    }

    for (const scene of script.scenes) {
      const prompt = promptPlan.scenePrompts.find((p) => p.scene === scene.sceneNumber);
      if (!prompt) continue;

      const scriptEmotion = scene.emotion;
      if (scriptEmotion === "reflection" && (prompt.camera === "wide_shot" && prompt.estimated_duration < 5)) {
        issues.push({
          engines: ["Story Engine", "Prompt Intelligence Engine"],
          description: `Scene ${scene.sceneNumber}: reflective emotion but short wide shot — may not convey depth`,
          severity: "medium",
          recommendedAction: "Increase shot duration or use slow push-in for reflective scenes",
        });
      }
    }

    return issues;
  }

  validatePromptImage(promptPlan: PromptPlan): CrossEngineIssue[] {
    const issues: CrossEngineIssue[] = [];

    const imageSceneIndices = new Set(
      promptPlan.scenePrompts.filter((p) => p.image_type === "symbolic_visual").map((p) => p.scene)
    );

    if (imageSceneIndices.size === 0) {
      issues.push({
        engines: ["Prompt Intelligence Engine", "Visual DNA System"],
        description: "No symbolic images planned — metaphors may not be visually represented",
        severity: "low",
        recommendedAction: "Consider adding symbolic image prompts to reinforce metaphors",
      });
    }

    return issues;
  }

  validateImageMotion(promptPlan: PromptPlan, motionTimeline: MotionTimeline): CrossEngineIssue[] {
    const issues: CrossEngineIssue[] = [];

    const sceneMotionMap = new Map<number, string>();
    for (const clip of motionTimeline.clips) {
      sceneMotionMap.set(clip.scene, clip.motion);
    }

    for (const prompt of promptPlan.scenePrompts) {
      const motion = sceneMotionMap.get(prompt.scene);
      if (!motion) continue;

      if (prompt.image_type === "word_visual" && motion === "hold") {
        issues.push({
          engines: ["Prompt Intelligence Engine", "Cinematic Motion Engine"],
          description: `Scene ${prompt.scene}: word visual but motion is hold — text may be static`,
          severity: "medium",
          recommendedAction: "Add subtle motion to word visual scenes (push-in or slow zoom)",
        });
      }
    }

    return issues;
  }

  validateMotionTimeline(motionTimeline: MotionTimeline, audio: AudioIntelligenceResult): CrossEngineIssue[] {
    const issues: CrossEngineIssue[] = [];

    const emphasisCount = audio.emphasis.length;
    const wordInserts = motionTimeline.clips.filter((c) => c.wordInsert).length;

    if (emphasisCount > 0 && wordInserts === 0) {
      issues.push({
        engines: ["Audio Intelligence System", "Cinematic Motion Engine"],
        description: `${emphasisCount} emphasized words but no motion word inserts`,
        severity: "medium",
        recommendedAction: "Add word-level motion inserts for emphasized words",
      });
    }

    const audioDuration = audio.metadata.duration;
    const motionDuration = motionTimeline.totalDuration;
    if (Math.abs(audioDuration - motionDuration) > 8) {
      issues.push({
        engines: ["Audio Intelligence System", "Cinematic Motion Engine"],
        description: `Large duration gap: audio=${audioDuration}s, motion=${motionDuration}s`,
        severity: "high",
        recommendedAction: "Adjust motion timeline to match audio duration",
      });
    }

    return issues;
  }

  validateAll(
    script: StoryScript,
    promptPlan: PromptPlan,
    motionTimeline: MotionTimeline,
    audio: AudioIntelligenceResult
  ): CrossEngineIssue[] {
    return [
      ...this.validateStoryPrompt(script, promptPlan),
      ...this.validatePromptImage(promptPlan),
      ...this.validateImageMotion(promptPlan, motionTimeline),
      ...this.validateMotionTimeline(motionTimeline, audio),
    ];
  }
}
