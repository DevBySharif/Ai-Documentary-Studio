import type { SRKeywordEmphasis } from "./types.js";

export class SRKeywordEmphasisEngine {
  private emphasizeMap: Record<string, (word: string) => SRKeywordEmphasis> = {};

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    this.emphasizeMap["fear"] = (w) => ({ word: w, emotion: "fear", style: "accent_color", color: "#FF4444", scale: 1 });
    this.emphasizeMap["danger"] = (w) => ({ word: w, emotion: "fear", style: "accent_color", color: "#FF4444", scale: 1 });
    this.emphasizeMap["hope"] = (w) => ({ word: w, emotion: "hope", style: "accent_color", color: "#4488FF", scale: 1 });
    this.emphasizeMap["future"] = (w) => ({ word: w, emotion: "future", style: "glow", color: "#FFD700", scale: 1.05 });
    this.emphasizeMap["imagine"] = (w) => ({ word: w, emotion: "wonder", style: "scale", color: "#FFFFFF", scale: 1.1 });
    this.emphasizeMap["why"] = (w) => ({ word: w, emotion: "question", style: "scale", color: "#FFFFFF", scale: 1.08 });
    this.emphasizeMap["how"] = (w) => ({ word: w, emotion: "question", style: "scale", color: "#FFFFFF", scale: 1.08 });
  }

  register(word: string, handler: (word: string) => SRKeywordEmphasis): void {
    this.emphasizeMap[word.toLowerCase()] = handler;
  }

  emphasize(word: string, contextEmotion?: string): SRKeywordEmphasis | null {
    const lower = word.toLowerCase().replace(/[^a-zA-Z]/g, "");
    const handler = this.emphasizeMap[lower];
    if (handler) return handler(word);

    if (contextEmotion) {
      return {
        word,
        emotion: contextEmotion,
        style: "bold",
        color: contextEmotion === "fear" ? "#FF4444" : contextEmotion === "hope" ? "#4488FF" : "#FFFFFF",
        scale: 1
      };
    }

    return null;
  }
}
