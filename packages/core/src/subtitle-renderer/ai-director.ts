import type { SRAISubtitleDecision, SRPosition, SRAnimationStyle } from "./types.js";

export class SRAISubtitleDirector {
  decide(emotion: string, cameraMovement: string, sceneBrightness: number, readingDifficulty: number, subtitleDensity: number): SRAISubtitleDecision {
    const lower = emotion.toLowerCase();

    let position: SRPosition = "bottom";
    let highlightTiming: "normal" | "extended" | "reduced" = "normal";
    let lineBreakStyle: "natural" | "compact" | "expanded" = "natural";
    let animation: SRAnimationStyle = "fade";
    let displayDuration = 3000;

    if (lower.includes("reflection") || lower.includes("sad")) {
      animation = "word_reveal";
      highlightTiming = "extended";
      displayDuration = 4000;
    } else if (lower.includes("urgency") || lower.includes("fear")) {
      animation = "pop";
      highlightTiming = "reduced";
      displayDuration = 2000;
    } else if (lower.includes("wonder") || lower.includes("curiosity")) {
      animation = "scale";
      highlightTiming = "extended";
      displayDuration = 3500;
    } else if (lower.includes("hope")) {
      animation = "slide";
      position = "center";
      displayDuration = 3500;
    }

    if (sceneBrightness > 0.8) position = "bottom";
    if (readingDifficulty > 0.7) { lineBreakStyle = "expanded"; displayDuration += 1000; }
    if (subtitleDensity > 0.6) { lineBreakStyle = "compact"; highlightTiming = "reduced"; }

    if (cameraMovement.includes("fast") || cameraMovement.includes("rapid")) {
      animation = "fade";
      displayDuration = Math.max(1500, displayDuration - 500);
    }

    return { position, highlightTiming, lineBreakStyle, animation, displayDuration };
  }
}
