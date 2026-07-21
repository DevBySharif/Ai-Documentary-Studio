import type { ImageAnalysis, VisualCameraAngle, CompositionType, LightingType, MoodTag } from "./types.js";

export class ImageAnalyzer {
  analyze(
    assetId: string,
    width: number,
    height: number,
    estimatedQuality: number,
    moodHint?: string
  ): ImageAnalysis {
    if (!assetId) throw new Error("assetId is required");
    if (typeof width !== "number" || width <= 0) throw new Error(`width must be a positive number, got ${width}`);
    if (typeof height !== "number" || height <= 0) throw new Error(`height must be a positive number, got ${height}`);

    const aspectRatio = this.detectAspectRatio(width, height);
    const qualityScore = Math.min(100, Math.max(0, estimatedQuality ?? 50));

    return {
      assetId,
      mainSubject: ["unknown"],
      background: "minimal",
      objects: [],
      lighting: this.inferLighting(aspectRatio, qualityScore),
      mood: this.resolveMood(moodHint),
      composition: this.inferComposition(aspectRatio),
      colorPalette: ["monochrome", "gray", "accent_blue"],
      cameraAngle: this.inferCameraAngle(aspectRatio),
      depth: qualityScore > 80 ? "medium" : "shallow",
      aspectRatio,
      qualityScore,
      sharpness: Math.min(100, qualityScore + 5),
      analyzedAt: new Date().toISOString(),
    };
  }

  private detectAspectRatio(width: number, height: number): string {
    const ratio = width / height;
    if (Math.abs(ratio - 16 / 9) < 0.05) return "16:9";
    if (Math.abs(ratio - 4 / 3) < 0.05) return "4:3";
    if (Math.abs(ratio - 9 / 16) < 0.05) return "9:16";
    if (Math.abs(ratio - 1) < 0.05) return "1:1";
    if (Math.abs(ratio - 21 / 9) < 0.05) return "21:9";
    return `${Math.round(ratio * 100)}:100`;
  }

  private inferLighting(_aspectRatio: string, quality: number): LightingType {
    if (quality > 90) return "cinematic";
    if (quality > 75) return "soft";
    if (quality > 50) return "ambient";
    return "natural";
  }

  private resolveMood(hint?: string): MoodTag {
    const valid: MoodTag[] = ["curiosity", "reflection", "wonder", "calm", "awe", "mystery", "melancholy", "neutral"];
    if (hint && (valid as string[]).includes(hint)) return hint as MoodTag;
    return "neutral";
  }

  private inferComposition(aspectRatio: string): CompositionType {
    if (aspectRatio === "16:9" || aspectRatio === "21:9") return "rule_of_thirds";
    if (aspectRatio === "9:16") return "centered";
    if (aspectRatio === "1:1") return "symmetrical";
    return "centered";
  }

  private inferCameraAngle(aspectRatio: string): VisualCameraAngle {
    if (aspectRatio === "16:9") return "medium";
    if (aspectRatio === "9:16") return "close_up";
    if (aspectRatio === "1:1") return "wide";
    return "medium";
  }
}
