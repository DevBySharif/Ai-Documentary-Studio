import type { DNAValidationResult } from "./types.js";

export class DNAValidation {
  validate(story: boolean, prompt: boolean, art: boolean, motion: boolean, subtitle: boolean, exportRules: boolean): DNAValidationResult {
    return {
      storyRules: story, promptRules: prompt, artStyle: art,
      motionRules: motion, subtitleRules: subtitle, exportRules,
      allValid: story && prompt && art && motion && subtitle && exportRules
    };
  }

  rejectIfInvalid(result: DNAValidationResult): string[] {
    const issues: string[] = [];
    if (!result.storyRules) issues.push("Story rules are incomplete");
    if (!result.promptRules) issues.push("Prompt rules are incomplete");
    if (!result.artStyle) issues.push("Art style is incomplete");
    if (!result.motionRules) issues.push("Motion rules are incomplete");
    if (!result.subtitleRules) issues.push("Subtitle rules are incomplete");
    if (!result.exportRules) issues.push("Export rules are incomplete");
    return issues;
  }
}
