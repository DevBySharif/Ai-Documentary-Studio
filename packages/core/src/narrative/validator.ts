import type { NarrativeBlueprint } from "./types.js";

export interface NarrativeValidationReport {
  passed: boolean;
  score: number;
  checks: Array<{
    field: string;
    status: "pass" | "warn" | "fail";
    message: string;
  }>;
}

export class NarrativeValidator {
  validate(blueprint: NarrativeBlueprint): NarrativeValidationReport {
    const checks: NarrativeValidationReport["checks"] = [];

    this.checkStructure(blueprint, checks);
    this.checkStoryArc(blueprint, checks);
    this.checkEmotionCurve(blueprint, checks);
    this.checkCuriosityLoops(blueprint, checks);
    this.checkSceneObjectives(blueprint, checks);
    this.checkRevealPlan(blueprint, checks);
    this.checkSyncPlan(blueprint, checks);

    const passed = checks.filter((c) => c.status === "pass").length;
    const score = checks.length > 0 ? Math.round((passed / checks.length) * 100) : 100;
    const hasFails = checks.some((c) => c.status === "fail");

    return { passed: !hasFails, score, checks };
  }

  private checkStructure(blueprint: NarrativeBlueprint, checks: NarrativeValidationReport["checks"]): void {
    if (!blueprint.coreQuestion) checks.push({ field: "coreQuestion", status: "fail", message: "Missing core question" });
    if (!blueprint.coreMessage) checks.push({ field: "coreMessage", status: "fail", message: "Missing core message" });
    if (!blueprint.learningGoal) checks.push({ field: "learningGoal", status: "fail", message: "Missing learning goal" });
    if (blueprint.sceneCount < 4) checks.push({ field: "sceneCount", status: "fail", message: `Too few scenes: ${blueprint.sceneCount}` });
    checks.push({ field: "structure", status: "pass", message: `${blueprint.sceneCount} scenes, ${blueprint.runtime}s` });
  }

  private checkStoryArc(blueprint: NarrativeBlueprint, checks: NarrativeValidationReport["checks"]): void {
    if (!blueprint.storyArc.phases || blueprint.storyArc.phases.length < 3) {
      checks.push({ field: "storyArc", status: "fail", message: "Story arc has too few phases" });
      return;
    }
    if (!blueprint.storyArc.phases.includes("hook")) {
      checks.push({ field: "storyArc.hook", status: "warn", message: "Story arc missing hook phase" });
    }
    if (!blueprint.storyArc.phases.includes("reveal") && !blueprint.storyArc.phases.includes("summary")) {
      checks.push({ field: "storyArc.resolution", status: "warn", message: "Story arc missing resolution phase" });
    }
    checks.push({ field: "storyArc", status: "pass", message: `${blueprint.storyArc.phases.length} phases: ${blueprint.storyArc.phases.join(" → ")}` });
  }

  private checkEmotionCurve(blueprint: NarrativeBlueprint, checks: NarrativeValidationReport["checks"]): void {
    if (!blueprint.emotionCurve || blueprint.emotionCurve.length === 0) {
      checks.push({ field: "emotionCurve", status: "fail", message: "Missing emotion curve" });
      return;
    }
    const hasPositiveEnd = ["satisfaction", "wonder", "calm", "hope", "understanding"].includes(
      blueprint.emotionCurve[blueprint.emotionCurve.length - 1]?.emotion
    );
    if (!hasPositiveEnd) {
      checks.push({ field: "emotionCurve.end", status: "warn", message: "Emotion curve may end on a negative note" });
    }
    checks.push({ field: "emotionCurve", status: "pass", message: `${blueprint.emotionCurve.length} emotion points` });
  }

  private checkCuriosityLoops(blueprint: NarrativeBlueprint, checks: NarrativeValidationReport["checks"]): void {
    if (!blueprint.curiosityLoops || blueprint.curiosityLoops.length === 0) {
      checks.push({ field: "curiosityLoops", status: "warn", message: "No curiosity loops planned" });
      return;
    }
    const unresolved = blueprint.curiosityLoops.filter(
      (l) => l.expectedCloseAtScene > blueprint.sceneCount
    );
    if (unresolved.length > 0) {
      checks.push({ field: "curiosityLoops.resolution", status: "warn", message: `${unresolved.length} loops may not resolve before end` });
    }
    checks.push({ field: "curiosityLoops", status: "pass", message: `${blueprint.curiosityLoops.length} loops planned` });
  }

  private checkSceneObjectives(blueprint: NarrativeBlueprint, checks: NarrativeValidationReport["checks"]): void {
    if (!blueprint.sceneObjectives || blueprint.sceneObjectives.length === 0) {
      checks.push({ field: "sceneObjectives", status: "fail", message: "No scene objectives defined" });
      return;
    }
    const missingGoals = blueprint.sceneObjectives.filter((o) => !o.goal);
    if (missingGoals.length > 0) {
      checks.push({ field: "sceneObjectives.goals", status: "warn", message: `${missingGoals.length} scenes missing goals` });
    }
    const totalDuration = blueprint.sceneObjectives.reduce((s, o) => s + o.expectedDuration, 0);
    if (Math.abs(totalDuration - blueprint.runtime) > blueprint.runtime * 0.3) {
      checks.push({ field: "sceneObjectives.duration", status: "warn", message: `Total scene duration (${totalDuration}s) differs from runtime (${blueprint.runtime}s)` });
    }
    checks.push({ field: "sceneObjectives", status: "pass", message: `${blueprint.sceneObjectives.length} scenes with objectives` });
  }

  private checkRevealPlan(blueprint: NarrativeBlueprint, checks: NarrativeValidationReport["checks"]): void {
    if (!blueprint.revealPlan) {
      checks.push({ field: "revealPlan", status: "fail", message: "Missing reveal plan" });
      return;
    }
    if (!blueprint.revealPlan.mainReveal.content) {
      checks.push({ field: "revealPlan.main", status: "fail", message: "Missing main reveal" });
    }
    if (blueprint.revealPlan.mainReveal.sceneIndex > blueprint.sceneCount) {
      checks.push({ field: "revealPlan.timing", status: "warn", message: "Main reveal scene exceeds scene count" });
    }
    checks.push({ field: "revealPlan", status: "pass", message: `Main reveal at scene ${blueprint.revealPlan.mainReveal.sceneIndex}, ${blueprint.revealPlan.supportingReveals.length} supporting, ${blueprint.revealPlan.surpriseMoments.length} surprises` });
  }

  private checkSyncPlan(blueprint: NarrativeBlueprint, checks: NarrativeValidationReport["checks"]): void {
    if (!blueprint.visualSyncPlan) {
      checks.push({ field: "visualSyncPlan", status: "warn", message: "No visual synchronization plan" });
      return;
    }
    if (blueprint.visualSyncPlan.sentences.length === 0) {
      checks.push({ field: "visualSyncPlan.sentences", status: "warn", message: "Empty sync plan" });
      return;
    }
    if (Math.abs(blueprint.visualSyncPlan.totalDuration - blueprint.runtime) > blueprint.runtime * 0.5) {
      checks.push({ field: "visualSyncPlan.duration", status: "warn", message: `Sync duration (${blueprint.visualSyncPlan.totalDuration}s) differs from runtime (${blueprint.runtime}s)` });
    }
    checks.push({ field: "visualSyncPlan", status: "pass", message: `${blueprint.visualSyncPlan.sentences.length} synced sentences, ${blueprint.visualSyncPlan.totalDuration}s total` });
  }
}
