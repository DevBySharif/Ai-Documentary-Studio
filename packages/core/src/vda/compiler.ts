import type { VisualDNAProfile } from "./types.js";
import type { ChannelDNA } from "../dna/types.js";
import { createZennProfile } from "./zenn.js";

export class VisualDNACompiler {
  compile(dna: ChannelDNA): VisualDNAProfile {
    const zenn = createZennProfile(dna.metadata.id);
    const visual = dna.visual;

    zenn.art.technique = this.resolveTechnique(visual.artStyle);
    zenn.art.illustration = visual.artStyle;
    zenn.art.outline = visual.outlineThickness === "none" ? "none" :
      visual.outlineThickness === "thin" ? "thin_black" :
      visual.outlineThickness === "thick" ? "thick_black" : "medium_black";
    zenn.art.background = visual.backgroundStyle === "solid_color" ? "solid_color" :
      visual.backgroundStyle === "pattern" ? "pattern" : "gradient";

    zenn.composition.defaultRule = visual.composition.includes("third") ? "rule_of_thirds" :
      visual.composition.includes("center") ? "centered" : "balanced";

    zenn.colors.primary = visual.colorPalette.primary;
    zenn.colors.accent = visual.colorPalette.accent;
    zenn.colors.neutral = visual.colorPalette.background;

    zenn.lighting.direction = visual.lighting.default.includes("side") ? "side" :
      visual.lighting.default.includes("back") ? "back" : "ambient";
    zenn.lighting.mood = this.resolveMood(visual.lighting.default);

    if (visual.cameraLanguage.default.includes("wide")) zenn.camera.default = "wide_shot";
    else if (visual.cameraLanguage.default.includes("close")) zenn.camera.default = "close_up";
    else zenn.camera.default = "medium_shot";

    zenn.metadata.name = `${dna.metadata.name} Visual DNA`;
    zenn.metadata.channelDnaId = dna.metadata.id;

    this.mergeSymbolism(zenn, visual.visualSymbolism);

    return zenn;
  }

  private resolveTechnique(style: string): "vector_flat" | "vector_gradient" | "hand_drawn" | "line_art" | "geometric" {
    if (style.includes("flat")) return "vector_flat";
    if (style.includes("gradient")) return "vector_gradient";
    if (style.includes("draw") || style.includes("sketch")) return "hand_drawn";
    if (style.includes("line") || style.includes("outline")) return "line_art";
    if (style.includes("geometric") || style.includes("shape")) return "geometric";
    return "vector_flat";
  }

  private resolveMood(lighting: string): "warm" | "cool" | "neutral" | "dramatic" | "calm" {
    if (lighting.includes("warm")) return "warm";
    if (lighting.includes("cool") || lighting.includes("blue")) return "cool";
    if (lighting.includes("dramatic") || lighting.includes("hard")) return "dramatic";
    if (lighting.includes("soft") || lighting.includes("diffuse")) return "calm";
    return "neutral";
  }

  private mergeSymbolism(profile: VisualDNAProfile, symbolism: Record<string, string>): void {
    for (const [concept, symbol] of Object.entries(symbolism)) {
      const existing = profile.metaphors.findIndex((m) => m.concept === concept);
      if (existing >= 0) {
        profile.metaphors[existing] = { ...profile.metaphors[existing], concept, symbol };
      } else {
        profile.metaphors.push({
          concept,
          symbol,
          description: `${symbol} representation`,
          visualStyle: "minimal_icon",
          animationPreference: "static",
          cameraPreference: "medium_shot",
          emotionMapping: {},
          reuseAllowed: true,
        });
      }
    }
  }
}
