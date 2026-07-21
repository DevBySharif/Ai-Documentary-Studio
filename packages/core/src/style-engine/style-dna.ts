import type { PermanentStyleDNA } from "./types.js";

export const DEFAULT_DOCUMENTARY_STYLE: PermanentStyleDNA = {
  artStyle: "minimal_documentary_stick",
  lineStyle: "clean_vector_ink",
  lighting: "soft_cinematic",
  contrast: "medium",
  texture: "flat",
  perspective: "cinematic",
  mood: "reflective",
};

export class PermanentStyleDNABuilder {
  build(overrides?: Partial<PermanentStyleDNA>): PermanentStyleDNA {
    return { ...DEFAULT_DOCUMENTARY_STYLE, ...overrides };
  }

  fromString(styleDescription: string): PermanentStyleDNA {
    if (!styleDescription) throw new Error("styleDescription string is required");

    const lower = styleDescription.toLowerCase();
    const style: PermanentStyleDNA = { ...DEFAULT_DOCUMENTARY_STYLE };

    if (lower.includes("minimal") || lower.includes("stick")) style.artStyle = "minimal_documentary_stick";
    if (lower.includes("vector") || lower.includes("ink")) style.lineStyle = "clean_vector_ink";
    if (lower.includes("line_art")) { style.artStyle = "line_art"; style.lineStyle = "thin_consistent"; }
    if (lower.includes("geometric")) style.artStyle = "geometric_flat";
    if (lower.includes("hand_drawn")) style.artStyle = "hand_drawn_minimal";

    if (lower.includes("soft") || lower.includes("cinematic")) style.lighting = "soft_cinematic";
    if (lower.includes("dramatic")) style.lighting = "hard_dramatic";
    if (lower.includes("ambient")) style.lighting = "ambient_natural";
    if (lower.includes("moody") || lower.includes("backlit")) style.lighting = "backlit_moody";
    if (lower.includes("diffused")) style.lighting = "diffused_soft";

    if (lower.includes("low contrast")) style.contrast = "low";
    if (lower.includes("high contrast")) style.contrast = "high";

    if (lower.includes("reflective") || lower.includes("thoughtful")) style.mood = "reflective";
    if (lower.includes("calm")) style.mood = "calm";
    if (lower.includes("melancholy") || lower.includes("sad")) style.mood = "melancholy";
    if (lower.includes("hopeful")) style.mood = "hopeful";

    return style;
  }

  compare(a: PermanentStyleDNA, b: PermanentStyleDNA): number {
    if (!a || !b) throw new Error("Both PermanentStyleDNA objects are required");

    let score = 0;
    if (a.artStyle === b.artStyle) score += 25;
    if (a.lineStyle === b.lineStyle) score += 15;
    if (a.lighting === b.lighting) score += 20;
    if (a.contrast === b.contrast) score += 10;
    if (a.texture === b.texture) score += 10;
    if (a.perspective === b.perspective) score += 10;
    if (a.mood === b.mood) score += 10;
    return score;
  }
}
