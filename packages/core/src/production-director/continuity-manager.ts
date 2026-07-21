import type { PDContinuityCheck } from "./types.js";

export class PDContinuityManager {
  check(characters: boolean, clothing: boolean, env: boolean, lighting: boolean, camera: boolean, palette: boolean, transitions: boolean): PDContinuityCheck {
    return {
      characters, clothing, environment: env, lighting,
      cameraDirection: camera, colorPalette: palette, sceneTransitions: transitions,
      allConsistent: characters && clothing && env && lighting && camera && palette && transitions
    };
  }

  getBreakReport(check: PDContinuityCheck): string[] {
    const breaks: string[] = [];
    if (!check.characters) breaks.push("Character inconsistency detected");
    if (!check.clothing) breaks.push("Clothing inconsistency detected");
    if (!check.environment) breaks.push("Environment inconsistency detected");
    if (!check.lighting) breaks.push("Lighting inconsistency detected");
    if (!check.cameraDirection) breaks.push("Camera direction inconsistency detected");
    if (!check.colorPalette) breaks.push("Color palette inconsistency detected");
    if (!check.sceneTransitions) breaks.push("Scene transition inconsistency detected");
    return breaks;
  }
}
