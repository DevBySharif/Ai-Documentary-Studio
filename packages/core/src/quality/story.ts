import type { CategoryScore } from "./types.js";
import type { StoryScript } from "../story/types.js";
import type { NarrativeBlueprint } from "../narrative/types.js";

export class StoryQualityInspector {
  inspect(script: StoryScript, blueprint: NarrativeBlueprint): CategoryScore {
    const warnings: string[] = [];
    const failures: string[] = [];
    let score = 100;

    if (script.scenes.length < 3) {
      score -= 20;
      failures.push("Too few scenes for coherent story");
    }

    const hasHook = script.scenes[0]?.purpose === "hook";
    if (!hasHook) {
      score -= 15;
      failures.push("Missing hook scene");
    }

    const hasCta = script.scenes[script.scenes.length - 1]?.purpose === "cta";
    if (!hasCta) {
      score -= 10;
      failures.push("Missing CTA scene");
    }

    const blueprintScenes = blueprint.sceneObjectives.length;
    const sceneDiff = Math.abs(script.scenes.length - blueprintScenes);
    if (sceneDiff > 2) {
      score -= Math.min(15, sceneDiff * 5);
      warnings.push(`Scene count (${script.scenes.length}) differs from blueprint (${blueprintScenes})`);
    }

    const totalDuration = script.totalDuration;
    const runtimeDiff = Math.abs(totalDuration - blueprint.runtime);
    if (runtimeDiff > blueprint.runtime * 0.3) {
      score -= 10;
      warnings.push(`Runtime ${totalDuration}s deviates significantly from blueprint ${blueprint.runtime}s`);
    }

    if (script.metadata.validated) score += 5;

    return {
      score: Math.max(0, Math.min(100, score)),
      maxScore: 100,
      passed: score >= 70,
      warnings,
      failures,
    };
  }
}

export class ScriptQualityInspector {
  inspect(script: StoryScript): CategoryScore {
    const warnings: string[] = [];
    const failures: string[] = [];
    let score = 100;

    let totalWords = 0;
    let longSentences = 0;

    for (const scene of script.scenes) {
      for (const sentence of scene.narration) {
        totalWords += sentence.wordCount;
        if (sentence.wordCount > 25) longSentences++;
      }
    }

    const longRatio = totalWords > 0 ? longSentences / (totalWords / 10) : 0;
    if (longRatio > 0.3) {
      score -= 10;
      warnings.push("Too many long sentences for spoken narration");
    }

    const uniqueEmotions = new Set(script.scenes.flatMap((s) => s.narration.map((n) => n.emotion)));
    if (uniqueEmotions.size < 2) {
      score -= 10;
      warnings.push("Limited emotional variation in narration");
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      maxScore: 100,
      passed: score >= 70,
      warnings,
      failures,
    };
  }
}
