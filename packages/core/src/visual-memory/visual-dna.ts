import type { VisualDNASignature, ImageAnalysis } from "./types.js";

export class VisualDNASignatureBuilder {
  build(analysis: ImageAnalysis, styleLabel: string): VisualDNASignature {
    if (!analysis) throw new Error("ImageAnalysis is required");

    return {
      style: styleLabel ?? "default",
      mood: analysis.mood ?? "neutral",
      camera: analysis.cameraAngle ?? "medium",
      lighting: analysis.lighting ?? "soft",
      color: this.extractColorSummary(analysis.colorPalette),
      emotion: analysis.mood ?? "neutral",
    };
  }

  private extractColorSummary(palette: string[]): string {
    if (!palette || palette.length === 0) return "unknown";
    const unique = [...new Set(palette.map((c) => (c ?? "").toLowerCase()).filter(Boolean))];
    if (unique.length <= 2) return unique.join("_") || "unknown";
    if (unique.every((c) => ["black", "white", "gray", "monochrome"].includes(c))) return "monochrome";
    return unique.slice(0, 3).join("_");
  }

  compare(a: VisualDNASignature, b: VisualDNASignature): number {
    if (!a || !b) throw new Error("Both VisualDNASignature objects are required");

    let matches = 0;
    let total = 5;

    if (a.style === b.style) matches++;
    if (a.mood === b.mood) matches++;
    if (a.camera === b.camera) matches++;
    if (a.lighting === b.lighting) matches++;
    if (a.color === b.color) matches++;

    return Math.round((matches / total) * 100);
  }
}
