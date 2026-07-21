import type { StyleValidationResult, PermanentStyleDNA } from "./types.js";

export class StyleValidator {
  validate(
    generatedStyle: Record<string, string>,
    reference: PermanentStyleDNA
  ): StyleValidationResult {
    if (!generatedStyle) throw new Error("generatedStyle object is required");
    if (!reference) throw new Error("PermanentStyleDNA reference is required");

    const aspects = ["artStyle", "lineWeight", "lighting", "composition", "colorPalette"];
    const referenceComparison: Record<string, number> = {};
    const issues: string[] = [];

    for (const aspect of aspects) {
      const genVal = generatedStyle[aspect];
      const refVal = (reference as unknown as Record<string, unknown>)[aspect];

      if (!genVal) {
        referenceComparison[aspect] = 0;
        issues.push(`Missing ${aspect} in generated style`);
      } else if (typeof genVal === "string" && typeof refVal === "string") {
        const match = genVal.toLowerCase() === refVal.toLowerCase() ? 100 : 40;
        referenceComparison[aspect] = match;
        if (match < 60) issues.push(`${aspect} mismatch: expected ${refVal}, got ${genVal}`);
      } else {
        referenceComparison[aspect] = 50;
      }
    }

    const scores = Object.values(referenceComparison);
    const styleScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const status = styleScore >= 80 ? "approved" : styleScore >= 60 ? "needs_review" : "rejected";

    return { styleScore, characterScore: styleScore, status, issues, referenceComparison };
  }
}
