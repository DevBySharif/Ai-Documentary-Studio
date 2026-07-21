import type { ColorLanguageState } from "./types.js";

export const DEFAULT_COLOR_LANGUAGE: ColorLanguageState = {
  base: "monochrome",
  accent: ["blue", "soft_white"],
  highlights: ["white", "light_gray"],
  background: ["dark_gray", "near_black"],
};

export class ColorLanguageManager {
  build(overrides?: Partial<ColorLanguageState>): ColorLanguageState {
    return { ...DEFAULT_COLOR_LANGUAGE, ...overrides };
  }

  isCompatible(color: string, language: ColorLanguageState): boolean {
    if (!color) return false;
    if (!language) throw new Error("ColorLanguageState is required");

    const lower = color.toLowerCase();
    const allColors = [language.base, ...language.accent, ...language.highlights, ...language.background].filter(Boolean);
    return allColors.some((c) => lower.includes(c));
  }

  suggestAccent(color: string, language: ColorLanguageState): string {
    if (!color) return language?.accent?.[0] ?? "blue";
    if (!language) return "blue";
    if (language.base === "monochrome") return language.accent[0] ?? "blue";
    return language.accent[0] ?? language.base;
  }

  describe(language: ColorLanguageState): string {
    if (!language) return "unknown color scheme";
    return `${language.base} with ${(language.accent ?? []).join(", ")} accents, ${(language.highlights ?? []).join(", ")} highlights on ${(language.background ?? []).join(", ")} backgrounds`;
  }
}
