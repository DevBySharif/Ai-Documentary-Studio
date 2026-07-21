import { TargetImageModel, PromptComponents, CompiledPrompt } from "./prompt-types";

/**
 * Model-Aware Optimizer (Vol 04 Part 06 - Section 7, Section 12).
 * Adapts raw prompt components and negative prompts into syntax tailored for specific image models.
 */
export class ModelOptimizer {
  public compilePrompt(components: PromptComponents, targetModel: TargetImageModel, version = 1): CompiledPrompt {
    const coreText = `${components.subject}, ${components.action}, in ${components.environment}, ${components.timePeriod} period, ${components.mood} mood. ${components.cameraAngle}, ${components.lens}, ${components.lighting}. Style: ${components.visualStyle}.`;

    switch (targetModel) {
      case "Midjourney":
        return {
          promptId: `prm_${Math.random().toString(36).substring(2, 7)}`,
          targetModel,
          positivePrompt: `${coreText} --ar 16:9 --style raw --v 6.0`,
          version,
        };
      case "SDXL":
        return {
          promptId: `prm_${Math.random().toString(36).substring(2, 7)}`,
          targetModel,
          positivePrompt: `${coreText}, 8k resolution, highly detailed documentary photography`,
          negativePrompt: "blurry, low quality, watermark, text artifacts, modern objects in historical scenes, deformed",
          version,
        };
      case "FLUX":
      case "GPTImage":
      case "Imagen":
      case "Ideogram":
      default:
        return {
          promptId: `prm_${Math.random().toString(36).substring(2, 7)}`,
          targetModel,
          positivePrompt: `A ${components.visualStyle} photograph depicting ${coreText}`,
          negativePrompt: "low quality, anatomical errors, modern artifacts",
          version,
        };
    }
  }
}
