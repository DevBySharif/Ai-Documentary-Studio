import type { StructuredPromptDNA, PermanentStyleDNA, CharacterDNAProfile } from "./types.js";

export class PromptDNACompiler {
  compile(
    sceneIntent: string,
    visualIntent: string,
    styleDNA: PermanentStyleDNA,
    characterDNA: CharacterDNAProfile
  ): StructuredPromptDNA {
    if (!sceneIntent) throw new Error("sceneIntent is required");
    if (!visualIntent) throw new Error("visualIntent is required");
    if (!styleDNA) throw new Error("PermanentStyleDNA is required");
    if (!characterDNA) throw new Error("CharacterDNAProfile is required");

    const compositionRules = this.buildCompositionRules(styleDNA);
    const lightingRules = this.buildLightingRules(styleDNA);
    const negativeRules = this.buildNegativeRules(styleDNA, characterDNA);

    const artStyleStr = (styleDNA.artStyle ?? "minimal_documentary_stick").replace(/_/g, " ");
    const lineStyleStr = (styleDNA.lineStyle ?? "clean_vector_ink").replace(/_/g, " ");
    const lightingStr = (styleDNA.lighting ?? "soft_cinematic").replace(/_/g, " ");
    const moodStr = (styleDNA.mood ?? "reflective");
    const bodyShapeStr = (characterDNA.bodyShape ?? "simple_stick").replace(/_/g, " ");
    const silhouStr = (characterDNA.silhouette ?? "stick_figure").replace(/_/g, " ");

    const stylePart = `${artStyleStr}, ${lineStyleStr}, ${lightingStr} lighting, ${moodStr} mood`;
    const characterPart = `stick figure character, ${bodyShapeStr}, ${silhouStr} silhouette`;
    const compositionPart = compositionRules.join(", ");
    const lightingPart = lightingRules.join(", ");
    const negativePart = `Negative: ${negativeRules.join(", ")}`;

    const finalPrompt = `${sceneIntent}, ${visualIntent}, ${characterPart}, ${stylePart}, ${compositionPart}, ${lightingPart}`;

    return {
      sceneIntent,
      visualIntent,
      styleDNA,
      characterDNA,
      compositionRules,
      lightingRules,
      negativeRules,
      finalPrompt,
    };
  }

  private buildCompositionRules(style: PermanentStyleDNA): string[] {
    const rules: string[] = [];
    rules.push("cinematic composition");
    rules.push("rule of thirds");
    if (style?.perspective === "cinematic") rules.push("cinematic perspective");
    if (style?.artStyle === "minimal_documentary_stick") rules.push("large negative space");
    return rules;
  }

  private buildLightingRules(style: PermanentStyleDNA): string[] {
    const rules: string[] = [];
    rules.push(`${(style?.lighting ?? "soft_cinematic").replace(/_/g, " ")}`);
    if (style?.contrast === "low") rules.push("low contrast");
    else if (style?.contrast === "high") rules.push("high contrast");
    rules.push("soft shadows");
    return rules;
  }

  private buildNegativeRules(_style: PermanentStyleDNA, _character: CharacterDNAProfile): string[] {
    return [
      "photorealistic",
      "3d render",
      "anime style",
      "cartoon",
      "detailed background",
      "multiple characters",
      "text in image",
      "watermark",
      "cluttered composition",
    ];
  }
}
