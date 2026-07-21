import type { ProjectDNA, CompiledProjectProfile } from "./types.js";

export interface ProjectValidationReport {
  passed: boolean;
  score: number;
  checks: Array<{
    field: string;
    status: "pass" | "warn" | "fail";
    message: string;
  }>;
}

export class ProjectValidator {
  validate(dna: ProjectDNA): ProjectValidationReport {
    const checks: ProjectValidationReport["checks"] = [];

    this.checkIdentity(dna, checks);
    this.checkEmotion(dna, checks);
    this.checkObjectives(dna, checks);
    this.checkBlueprint(dna, checks);
    this.checkIntelligence(dna, checks);
    this.checkMetaphors(dna, checks);

    const passed = checks.filter((c) => c.status === "pass").length;
    const score = checks.length > 0 ? Math.round((passed / checks.length) * 100) : 100;
    const hasFails = checks.some((c) => c.status === "fail");

    return { passed: !hasFails, score, checks };
  }

  validateCompiled(profile: CompiledProjectProfile): ProjectValidationReport {
    const checks: ProjectValidationReport["checks"] = [];

    if (!profile.source) {
      checks.push({ field: "source", status: "fail", message: "Missing source ProjectDNA" });
    }
    if (!profile.compiledAt) {
      checks.push({ field: "compiledAt", status: "fail", message: "Missing compilation timestamp" });
    }
    if (profile.cache.avoidSet.size === 0) {
      checks.push({ field: "avoidSet", status: "warn", message: "No avoid rules in cache" });
    }
    if (profile.cache.patternSet.size === 0) {
      checks.push({ field: "patternSet", status: "warn", message: "No preferred patterns in cache" });
    }

    checks.push({ field: "runtime", status: "pass", message: `${Object.keys(profile.runtime).length} runtime sections` });
    checks.push({ field: "cache", status: "pass", message: `Metaphors: ${Object.keys(profile.cache.metaphorLookup).length}, Colors: ${Object.keys(profile.cache.colorMap).length}` });

    const hasFails = checks.some((c) => c.status === "fail");
    const passed = checks.filter((c) => c.status === "pass").length;
    const score = checks.length > 0 ? Math.round((passed / checks.length) * 100) : 100;

    return { passed: !hasFails, score, checks };
  }

  private checkIdentity(dna: ProjectDNA, checks: ProjectValidationReport["checks"]): void {
    const i = dna.identity;
    if (!i.projectName) checks.push({ field: "identity.projectName", status: "fail", message: "Missing project name" });
    if (!i.topic) checks.push({ field: "identity.topic", status: "fail", message: "Missing topic" });
    if (!i.primarySubject) checks.push({ field: "identity.primarySubject", status: "fail", message: "Missing primary subject" });
    if (i.estimatedRuntime <= 0) checks.push({ field: "identity.estimatedRuntime", status: "fail", message: "Invalid runtime" });
    if (i.estimatedRuntime > 0) checks.push({ field: "identity.estimatedRuntime", status: "pass", message: `${i.estimatedRuntime}s` });
    checks.push({ field: "identity", status: "pass", message: `Project: ${i.projectName || "unnamed"}` });
  }

  private checkEmotion(dna: ProjectDNA, checks: ProjectValidationReport["checks"]): void {
    if (!dna.coreEmotion) {
      checks.push({ field: "coreEmotion", status: "fail", message: "Missing core emotion" });
      return;
    }
    checks.push({ field: "coreEmotion", status: "pass", message: `Emotion: ${dna.coreEmotion}` });

    const blueprintEmotions = dna.blueprint.emotionTimeline.map((e) => e.emotion);
    if (blueprintEmotions.length > 0 && !blueprintEmotions.includes(dna.coreEmotion)) {
      checks.push({
        field: "emotionTimeline",
        status: "warn",
        message: `Core emotion "${dna.coreEmotion}" not in blueprint timeline`,
      });
    }
  }

  private checkObjectives(dna: ProjectDNA, checks: ProjectValidationReport["checks"]): void {
    if (!dna.storyObjective) checks.push({ field: "storyObjective", status: "fail", message: "Missing story objective" });
    if (!dna.visualObjective) checks.push({ field: "visualObjective", status: "fail", message: "Missing visual objective" });
    if (!dna.editingObjective) checks.push({ field: "editingObjective", status: "fail", message: "Missing editing objective" });
    if (!dna.learningObjective) checks.push({ field: "learningObjective", status: "fail", message: "Missing learning objective" });

    checks.push({
      field: "objectives",
      status: dna.storyObjective && dna.visualObjective && dna.editingObjective ? "pass" : "fail",
      message: `Story: ${dna.storyObjective || "—"}, Visual: ${dna.visualObjective || "—"}, Editing: ${dna.editingObjective || "—"}`,
    });
  }

  private checkBlueprint(dna: ProjectDNA, checks: ProjectValidationReport["checks"]): void {
    const b = dna.blueprint;
    if (!b.videoGoal) checks.push({ field: "blueprint.videoGoal", status: "fail", message: "Missing video goal" });
    if (!b.coreQuestion) checks.push({ field: "blueprint.coreQuestion", status: "fail", message: "Missing core question" });
    if (!b.coreMessage) checks.push({ field: "blueprint.coreMessage", status: "fail", message: "Missing core message" });
    if (!b.learningObjective) checks.push({ field: "blueprint.learningObjective", status: "fail", message: "Missing learning objective" });
    if (b.sceneCount <= 0) checks.push({ field: "blueprint.sceneCount", status: "fail", message: "Invalid scene count" });
    if (b.emotionTimeline.length === 0) checks.push({ field: "blueprint.emotionTimeline", status: "warn", message: "Empty emotion timeline" });

    checks.push({
      field: "blueprint",
      status: b.videoGoal && b.coreQuestion && b.coreMessage ? "pass" : "fail",
      message: b.approved ? "Approved" : "Pending approval",
    });
  }

  private checkIntelligence(dna: ProjectDNA, checks: ProjectValidationReport["checks"]): void {
    const pip = dna.intelligence;
    if (pip.avoidList.length === 0) checks.push({ field: "intelligence.avoidList", status: "warn", message: "Empty avoid list" });
    if (pip.preferredPatterns.length === 0) checks.push({ field: "intelligence.preferredPatterns", status: "warn", message: "Empty preferred patterns" });
    if (pip.riskDetection.length === 0) checks.push({ field: "intelligence.riskDetection", status: "warn", message: "No risk detection rules" });

    checks.push({
      field: "intelligence",
      status: "pass",
      message: `${pip.avoidList.length} avoids, ${pip.preferredPatterns.length} patterns, ${pip.riskDetection.length} risks`,
    });
  }

  private checkMetaphors(dna: ProjectDNA, checks: ProjectValidationReport["checks"]): void {
    if (dna.metaphorLibrary.length === 0) {
      checks.push({ field: "metaphorLibrary", status: "warn", message: "No visual metaphors defined" });
    } else {
      checks.push({ field: "metaphorLibrary", status: "pass", message: `${dna.metaphorLibrary.length} metaphors` });
    }
  }
}
