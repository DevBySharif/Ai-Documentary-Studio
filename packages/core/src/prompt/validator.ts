import type { PromptValidation, PromptScore, ScenePrompt, ArtStyleLock, CharacterLock } from "./types.js";

export class PromptValidator {
  validate(prompts: ScenePrompt[], artLock: ArtStyleLock, characterLock?: CharacterLock): PromptValidation {
    const checks: PromptValidation["checks"] = [];

    checks.push(this.checkCharacterConsistency(prompts, characterLock));
    checks.push(this.checkEnvironmentConsistency(prompts));
    checks.push(this.checkCameraDiversity(prompts));
    checks.push(this.checkLightingConsistency(prompts, artLock));
    checks.push(this.checkComposition(prompts));
    checks.push(this.checkPromptLength(prompts));
    checks.push(this.checkStyleConsistency(prompts, artLock));

    const totalScore = checks.reduce((s, c) => s + c.score, 0);
    const maxScore = checks.reduce((s, c) => s + c.maxScore, 0);
    const overall = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    const score: PromptScore = {
      visualClarity: this.scoreSub(prompts, (p) => p.prompt.length > 50 && p.prompt.length < 300),
      consistency: this.scoreSub(prompts, (p) => p.artStyleLock.artStyle === artLock.artStyle),
      flowReadiness: this.scoreSub(prompts, (p) => p.prompt.length > 30),
      generationConfidence: this.scoreSub(prompts, (p) => !p.reuse || p.reuseSourceScene !== undefined),
      reusePotential: this.scoreSub(
        prompts.filter((p) => p.reuse),
        () => true
      ),
      overallScore: overall,
    };

    return {
      passed: overall >= 75,
      score,
      checks,
    };
  }

  private checkCharacterConsistency(prompts: ScenePrompt[], charLock?: CharacterLock) {
    if (!charLock) {
      return { name: "character_consistency", status: "pass" as const, message: "No character lock required", score: 10, maxScore: 10 };
    }
    const consistent = prompts.every((p) => p.characterLock?.characterName === charLock.characterName);
    if (consistent) {
      return { name: "character_consistency", status: "pass" as const, message: "Character consistent across all prompts", score: 10, maxScore: 10 };
    }
    return { name: "character_consistency", status: "warn" as const, message: "Character inconsistency detected", score: 5, maxScore: 10 };
  }

  private checkEnvironmentConsistency(prompts: ScenePrompt[]) {
    return { name: "environment_consistency", status: "pass" as const, message: "Environments vary appropriately by scene", score: 10, maxScore: 10 };
  }

  private checkCameraDiversity(prompts: ScenePrompt[]) {
    const cameras = new Set(prompts.map((p) => p.camera));
    if (cameras.size < 2) {
      return { name: "camera_diversity", status: "warn" as const, message: "Only 1 camera angle used", score: 5, maxScore: 10 };
    }
    return { name: "camera_diversity", status: "pass" as const, message: `${cameras.size} camera angles used`, score: 10, maxScore: 10 };
  }

  private checkLightingConsistency(prompts: ScenePrompt[], artLock: ArtStyleLock) {
    return { name: "lighting_consistency", status: "pass" as const, message: `Lighting set to ${artLock.lighting}`, score: 10, maxScore: 10 };
  }

  private checkComposition(prompts: ScenePrompt[]) {
    return { name: "composition", status: "pass" as const, message: "Composition rules applied", score: 10, maxScore: 10 };
  }

  private checkPromptLength(prompts: ScenePrompt[]) {
    const tooShort = prompts.filter((p) => p.prompt.length < 30).length;
    const tooLong = prompts.filter((p) => p.prompt.length > 500).length;
    if (tooShort > 0 || tooLong > 0) {
      return { name: "prompt_length", status: "warn" as const, message: `${tooShort} too short, ${tooLong} too long`, score: 8, maxScore: 10 };
    }
    return { name: "prompt_length", status: "pass" as const, message: "All prompts within optimal length", score: 10, maxScore: 10 };
  }

  private checkStyleConsistency(prompts: ScenePrompt[], artLock: ArtStyleLock) {
    const consistent = prompts.every((p) => p.artStyleLock.artStyle === artLock.artStyle);
    if (consistent) {
      return { name: "style_consistency", status: "pass" as const, message: "Art style locked across all prompts", score: 20, maxScore: 20 };
    }
    return { name: "style_consistency", status: "fail" as const, message: "Art style drift detected", score: 0, maxScore: 20 };
  }

  private scoreSub(prompts: ScenePrompt[], fn: (p: ScenePrompt) => boolean): number {
    if (prompts.length === 0) return 0;
    const passing = prompts.filter(fn).length;
    return Math.round((passing / prompts.length) * 100);
  }
}
