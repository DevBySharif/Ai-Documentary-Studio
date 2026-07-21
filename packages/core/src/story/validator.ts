import type { ScriptValidationReport, StoryScript } from "./types.js";
import { TimingEstimator } from "./timing.js";

export class ScriptValidator {
  private timingEstimator: TimingEstimator;

  constructor() {
    this.timingEstimator = new TimingEstimator();
  }

  validate(
    script: StoryScript,
    targetRuntime: number,
    blueprintSceneCount: number
  ): ScriptValidationReport {
    const checks: ScriptValidationReport["checks"] = [];

    checks.push(this.checkStoryCoherence(script));
    checks.push(this.checkLogicalFlow(script));
    checks.push(this.checkHookQuality(script));
    checks.push(this.checkCuriosityProgression(script));
    checks.push(this.checkRedundancy(script));
    checks.push(this.checkRuntimeTarget(script, targetRuntime));
    checks.push(this.checkBlueprintAlignment(script, blueprintSceneCount));

    const totalScore = checks.reduce((s, c) => s + c.score, 0);
    const maxScore = checks.reduce((s, c) => s + c.maxScore, 0);
    const score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = score >= 80;

    return { passed, score, checks };
  }

  private checkStoryCoherence(script: StoryScript) {
    const sceneCount = script.scenes.length;
    if (sceneCount < 3) {
      return { name: "story_coherence", status: "fail" as const, message: "Too few scenes for coherent story", score: 0, maxScore: 20 };
    }
    const hasHook = script.scenes[0]?.purpose === "hook";
    const hasCTA = script.scenes[script.scenes.length - 1]?.purpose === "cta";
    if (hasHook && hasCTA) {
      return { name: "story_coherence", status: "pass" as const, message: "Story has clear beginning and end", score: 20, maxScore: 20 };
    }
    return { name: "story_coherence", status: "warn" as const, message: "Missing hook or CTA scene", score: 10, maxScore: 20 };
  }

  private checkLogicalFlow(script: StoryScript) {
    const validPurposes = ["hook", "context", "explain", "evidence", "reveal", "summarize", "cta", "transition"];
    for (let i = 1; i < script.scenes.length; i++) {
      const prevIdx = validPurposes.indexOf(script.scenes[i - 1].purpose);
      const currIdx = validPurposes.indexOf(script.scenes[i].purpose);
      if (currIdx < prevIdx && currIdx !== 0) {
        return { name: "logical_flow", status: "warn" as const, message: `Scene ${i} purpose breaks logical progression`, score: 10, maxScore: 15 };
      }
    }
    return { name: "logical_flow", status: "pass" as const, message: "Logical flow maintained", score: 15, maxScore: 15 };
  }

  private checkHookQuality(script: StoryScript) {
    const hook = script.hook;
    if (!hook || !hook.text) {
      return { name: "hook_quality", status: "fail" as const, message: "No hook generated", score: 0, maxScore: 15 };
    }
    const wordCount = hook.text.split(" ").length;
    if (wordCount < 5 || wordCount > 30) {
      return { name: "hook_quality", status: "warn" as const, message: `Hook length (${wordCount} words) outside optimal range`, score: 8, maxScore: 15 };
    }
    return { name: "hook_quality", status: "pass" as const, message: `Hook uses ${hook.pattern} pattern`, score: 15, maxScore: 15 };
  }

  private checkCuriosityProgression(script: StoryScript) {
    const emotionSequence = script.scenes.flatMap((s) => s.narration.map((n) => n.emotion));
    if (emotionSequence.length < 3) {
      return { name: "curiosity_progression", status: "fail" as const, message: "Not enough sentences for progression", score: 0, maxScore: 15 };
    }
    const uniqueEmotions = new Set(emotionSequence).size;
    if (uniqueEmotions < 2) {
      return { name: "curiosity_progression", status: "warn" as const, message: "Too few emotion variations", score: 5, maxScore: 15 };
    }
    return { name: "curiosity_progression", status: "pass" as const, message: `${uniqueEmotions} unique emotions across script`, score: 15, maxScore: 15 };
  }

  private checkRedundancy(script: StoryScript) {
    const texts = script.scenes.flatMap((s) => s.narration.map((n) => n.text));
    const uniqueTexts = new Set(texts.map((t) => t.toLowerCase().trim()));
    if (uniqueTexts.size < texts.length) {
      const dupes = texts.length - uniqueTexts.size;
      return { name: "redundancy", status: "warn" as const, message: `${dupes} duplicate sentences found`, score: 8, maxScore: 10 };
    }
    return { name: "redundancy", status: "pass" as const, message: "No redundant sentences", score: 10, maxScore: 10 };
  }

  private checkRuntimeTarget(script: StoryScript, targetRuntime: number) {
    const total = this.timingEstimator.estimateSentences(
      script.scenes.flatMap((s) => s.narration)
    ).reduce((s, n) => s + n.estimatedDuration, 0);
    const diff = Math.abs(total - targetRuntime);
    if (diff > targetRuntime * 0.5) {
      return { name: "runtime_target", status: "fail" as const, message: `Runtime ${total}s is ${Math.round(diff / targetRuntime * 100)}% off target ${targetRuntime}s`, score: 0, maxScore: 10 };
    }
    if (diff > targetRuntime * 0.25) {
      return { name: "runtime_target", status: "warn" as const, message: `Runtime ${total}s deviates ${Math.round(diff / targetRuntime * 100)}% from target`, score: 5, maxScore: 10 };
    }
    return { name: "runtime_target", status: "pass" as const, message: `Runtime ${total}s within 25% of target ${targetRuntime}s`, score: 10, maxScore: 10 };
  }

  private checkBlueprintAlignment(script: StoryScript, expectedScenes: number) {
    const sceneDiff = Math.abs(script.scenes.length - expectedScenes);
    if (sceneDiff > 3) {
      return { name: "blueprint_alignment", status: "fail" as const, message: `Scene count ${script.scenes.length} differs from blueprint ${expectedScenes} by ${sceneDiff}`, score: 0, maxScore: 15 };
    }
    if (sceneDiff > 0) {
      return { name: "blueprint_alignment", status: "warn" as const, message: `Scene count ${script.scenes.length} vs blueprint ${expectedScenes}`, score: 8, maxScore: 15 };
    }
    return { name: "blueprint_alignment", status: "pass" as const, message: `Scene count matches blueprint (${expectedScenes})`, score: 15, maxScore: 15 };
  }
}
