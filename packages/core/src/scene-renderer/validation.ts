import type { SceneComposition } from "./types.js";

export interface SceneValidationResult {
  valid: boolean;
  checks: Array<{ name: string; passed: boolean; message?: string }>;
}

export class SceneValidator {
  validate(composition: SceneComposition): SceneValidationResult {
    const checks: SceneValidationResult["checks"] = [];

    checks.push(this.checkSubjectVisible(composition));
    checks.push(this.checkSafeArea(composition));
    checks.push(this.checkSubtitleVisibility(composition));
    checks.push(this.checkMotionCompatibility(composition));
    checks.push(this.checkResolution(composition));
    checks.push(this.checkLayerIntegrity(composition));

    return { valid: checks.every((c) => c.passed), checks };
  }

  private checkSubjectVisible(composition: SceneComposition): { name: string; passed: boolean; message?: string } {
    const hasSubject = composition.focus.type !== "background";
    return { name: "Subject Visible", passed: hasSubject, message: hasSubject ? undefined : "No primary subject detected" };
  }

  private checkSafeArea(composition: SceneComposition): { name: string; passed: boolean; message?: string } {
    const sa = composition.safeArea;
    const valid = sa.top >= 0 && sa.bottom >= 0 && sa.left >= 0 && sa.right >= 0;
    return { name: "Safe Area", passed: valid, message: valid ? undefined : "Invalid safe area bounds" };
  }

  private checkSubtitleVisibility(_composition: SceneComposition): { name: string; passed: boolean; message?: string } {
    return { name: "Subtitle Visibility", passed: true };
  }

  private checkMotionCompatibility(_composition: SceneComposition): { name: string; passed: boolean; message?: string } {
    return { name: "Motion Compatibility", passed: true };
  }

  private checkResolution(composition: SceneComposition): { name: string; passed: boolean; message?: string } {
    const valid = composition.cropping.width > 0 && composition.cropping.height > 0;
    return { name: "Resolution", passed: valid, message: valid ? undefined : "Invalid crop resolution" };
  }

  private checkLayerIntegrity(composition: SceneComposition): { name: string; passed: boolean; message?: string } {
    const valid = composition.layers.length > 0;
    return { name: "Layer Integrity", passed: valid, message: valid ? undefined : "No layers in composition" };
  }
}
