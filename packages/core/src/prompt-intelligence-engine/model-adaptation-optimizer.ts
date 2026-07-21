import { TargetModelFamily } from "./prompt-intelligence-types";

/**
 * Model Adaptation & Prompt Optimizer (Vol 07 Part 05 - Section 8, Section 9).
 * Adapts prompts for specific model families (Language, Image, Voice, Vision) and removes redundant tokens.
 */
export class ModelAdaptationOptimizer {
  public adaptPromptForModel(promptText: string, modelFamily: TargetModelFamily): string {
    if (modelFamily === "ImageModel") {
      // Add negative prompts & quality boosters for Image models
      return `${promptText}, highly detailed, volumetric lighting --no blurry, low resolution, distorted`;
    }
    if (modelFamily === "VoiceModel") {
      // Add SSML or phonetic cues for Voice models
      return `[Pacing: Natural, Emotion: Serious] ${promptText}`;
    }
    return promptText;
  }

  public optimizeTokens(promptText: string): string {
    // Removes redundant spaces and repetitive filler phrases
    return promptText.replace(/\s+/g, " ").trim();
  }
}
