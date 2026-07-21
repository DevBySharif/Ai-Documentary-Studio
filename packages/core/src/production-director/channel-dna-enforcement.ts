import type { PDChannelDNAEnforcementResult } from "./types.js";

export class PDChannelDNAEnforcement {
  check(story: boolean, character: boolean, art: boolean, prompt: boolean, motion: boolean, subtitle: boolean, color: boolean, camera: boolean): PDChannelDNAEnforcementResult {
    return {
      storyStructure: story, characterStyle: character, artStyle: art,
      promptStyle: prompt, motionLanguage: motion, subtitleLanguage: subtitle,
      colorLanguage: color, cameraLanguage: camera,
      allPassed: story && character && art && prompt && motion && subtitle && color && camera
    };
  }

  rejectIfViolated(report: PDChannelDNAEnforcementResult): string[] {
    const violations: string[] = [];
    if (!report.storyStructure) violations.push("Story structure violates Channel DNA");
    if (!report.characterStyle) violations.push("Character style violates Channel DNA");
    if (!report.artStyle) violations.push("Art style violates Channel DNA");
    if (!report.motionLanguage) violations.push("Motion language violates Channel DNA");
    if (!report.colorLanguage) violations.push("Color language violates Channel DNA");
    return violations;
  }
}
