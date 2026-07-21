import type { ImageType, CameraAngle, MotionSuggestion, LightingStyle } from "./types.js";
import type { ArtStyleLock, CharacterLock } from "./types.js";

const NEGATIVE_PROMPT_BASE = "text, watermark, logo, photorealistic, 3d, blurry, low quality, artifacts, extra limbs, bad anatomy, ugly, distorted, deformed, bad proportions, duplicate, cropped, worst quality";

const IMAGE_TYPE_EXTRAS: Record<string, string> = {
  master_scene: "",
  supporting_scene: "",
  word_visual: "words, letters, typography, writing",
  symbolic_visual: "literal, photorealistic, detailed texture",
  transition_visual: "static, still, frozen",
};

const STYLE_CONFLICTS: Record<string, string[]> = {
  minimalist_vector: ["photorealistic", "oil painting", "watercolor", "sketch", "3d render"],
};

export class GoogleFlowOptimizer {
  buildPrompt(
    subject: string,
    environment: string,
    action: string,
    artLock: ArtStyleLock,
    characterLock?: CharacterLock
  ): string {
    const parts: string[] = [];

    if (characterLock) {
      parts.push(`Character: ${characterLock.characterName}`);
    }

    if (subject) parts.push(subject);
    if (action) parts.push(action);
    if (environment) parts.push(`Environment: ${environment}`);

    parts.push(`Art Style: ${artLock.artStyle}`);
    parts.push(`Colors: ${artLock.primaryColors.slice(0, 3).join(", ")}`);
    parts.push(`Lighting: ${artLock.lighting}`);
    parts.push(`Composition: ${artLock.composition}`);
    parts.push(`Perspective: ${artLock.perspective}`);

    if (characterLock) {
      parts.push(`Expression: ${characterLock.expressionStyle}`);
    }

    return parts.join(", ");
  }

  buildNegativePrompt(imageType: ImageType, artStyle: string): string {
    const extras = IMAGE_TYPE_EXTRAS[imageType] || "";
    const styleConflicts = STYLE_CONFLICTS[artStyle] || [];
    const conflicts = styleConflicts.join(", ");
    return [NEGATIVE_PROMPT_BASE, extras, conflicts].filter(Boolean).join(", ");
  }

  optimizePrompt(rawPrompt: string): string {
    return rawPrompt
      .replace(/\s+/g, " ")
      .replace(/,\s*,/g, ",")
      .replace(/^,|,$/g, "")
      .trim();
  }

  addCameraMotion(
    prompt: string,
    camera: CameraAngle,
    motion: MotionSuggestion
  ): string {
    const cameraInfo = `Camera: ${camera}, Motion: ${motion}`;
    return `${prompt}, ${cameraInfo}`;
  }
}
