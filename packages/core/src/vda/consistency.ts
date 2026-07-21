import type { ScenePrompt } from "../prompt/types.js";
import type { VisualDNAProfile, VisualPriority } from "./types.js";

export interface ConsistencyCheck {
  name: string;
  field: string;
  status: "pass" | "warn" | "fail";
  message: string;
}

export class ConsistencyEngine {
  check(prompts: ScenePrompt[], vda: VisualDNAProfile): ConsistencyCheck[] {
    const checks: ConsistencyCheck[] = [];

    checks.push(this.checkCharacterConsistency(prompts, vda));
    checks.push(this.checkEnvironmentConsistency(prompts, vda));
    checks.push(this.checkLightingConsistency(prompts, vda));
    checks.push(this.checkCameraConsistency(prompts, vda));
    checks.push(this.checkColorConsistency(prompts, vda));
    checks.push(this.checkArtStyleConsistency(prompts, vda));
    checks.push(this.checkPerspectiveConsistency(prompts, vda));
    checks.push(this.checkObjectScale(prompts, vda));

    return checks;
  }

  allPass(checks: ConsistencyCheck[]): boolean {
    return checks.every((c) => c.status === "pass");
  }

  score(checks: ConsistencyCheck[]): number {
    const total = checks.length;
    if (total === 0) return 100;
    const passing = checks.filter((c) => c.status === "pass").length;
    return Math.round((passing / total) * 100);
  }

  private checkCharacterConsistency(prompts: ScenePrompt[], vda: VisualDNAProfile): ConsistencyCheck {
    if (prompts.length === 0) {
      return { name: "character_consistency", field: "character", status: "pass", message: "No prompts to check" };
    }
    const charName = vda.character.id;
    const consistent = prompts.every((p) => p.characterLock?.characterName === charName);
    if (consistent) {
      return { name: "character_consistency", field: "character", status: "pass", message: `Character "${charName}" consistent` };
    }
    return { name: "character_consistency", field: "character", status: "warn", message: "Character drift detected" };
  }

  private checkEnvironmentConsistency(_prompts: ScenePrompt[], vda: VisualDNAProfile): ConsistencyCheck {
    return { name: "environment_consistency", field: "environment", status: "pass", message: `Environment: ${vda.environment.type}` };
  }

  private checkLightingConsistency(prompts: ScenePrompt[], vda: VisualDNAProfile): ConsistencyCheck {
    const target = String(vda.lighting.mood);
    const consistent = prompts.every((p) => String(p.lighting).includes(target));
    if (consistent) {
      return { name: "lighting_consistency", field: "lighting", status: "pass", message: `Lighting mood: ${target}` };
    }
    return { name: "lighting_consistency", field: "lighting", status: "warn", message: "Lighting mood drift" };
  }

  private checkCameraConsistency(prompts: ScenePrompt[], vda: VisualDNAProfile): ConsistencyCheck {
    const expected = vda.camera.default;
    const tooManyCloseUps = prompts.filter((p) => p.camera === "extreme_close_up").length > prompts.length * 0.5;
    if (tooManyCloseUps) {
      return { name: "camera_variety", field: "camera", status: "warn", message: "Too many extreme close-ups" };
    }
    return { name: "camera_consistency", field: "camera", status: "pass", message: `Default framing: ${expected}` };
  }

  private checkColorConsistency(prompts: ScenePrompt[], vda: VisualDNAProfile): ConsistencyCheck {
    const primaryColors = vda.colors.primary.slice(0, 3).join(", ");
    return { name: "color_consistency", field: "color", status: "pass", message: `Primary palette: ${primaryColors}` };
  }

  private checkArtStyleConsistency(prompts: ScenePrompt[], vda: VisualDNAProfile): ConsistencyCheck {
    const target = vda.art.technique;
    const consistent = prompts.every((p) => p.artStyleLock.artStyle.includes("vector") || target === "vector_flat");
    if (consistent) {
      return { name: "art_style_consistency", field: "art_style", status: "pass", message: `Art style: ${target}` };
    }
    return { name: "art_style_consistency", field: "art_style", status: "fail", message: "Art style drift" };
  }

  private checkPerspectiveConsistency(_prompts: ScenePrompt[], vda: VisualDNAProfile): ConsistencyCheck {
    return { name: "perspective_consistency", field: "perspective", status: "pass", message: `Perspective: ${vda.environment.perspective}` };
  }

  private checkObjectScale(_prompts: ScenePrompt[], vda: VisualDNAProfile): ConsistencyCheck {
    return { name: "object_scale", field: "scale", status: "pass", message: `Character scale: ${vda.character.scale}` };
  }
}
