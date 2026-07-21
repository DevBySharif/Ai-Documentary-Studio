import { ImageGenPlan, CameraAngle, CompositionRule } from "./storyboard-types";

/**
 * Structured Image Generation Planner (Vol 04 Part 04 - Section 12).
 * Prepares image-generation plans (subject, environment, mood, historical constraints) for the downstream Prompt Generator.
 */
export class ImageGenerationPlanner {
  public createPlan(
    subject: string,
    environment: string,
    timePeriod: string,
    mood: string,
    cameraAngle: CameraAngle,
    composition: CompositionRule
  ): ImageGenPlan {
    return {
      subject,
      environment,
      timePeriod,
      mood,
      cameraAngle,
      composition,
      visualStyle: "Authentic Historical Documentary Photography",
      historicalConstraints: [
        `Must match ${timePeriod} architecture and attire.`,
        "No modern technology or unnatural artifacts.",
      ],
    };
  }
}
