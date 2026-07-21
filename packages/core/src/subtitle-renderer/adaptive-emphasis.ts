import type { SRKeywordEmphasis, SREmphasisStyle } from "./types.js";

export class SRAdaptiveKeywordEmphasis {
  emphasize(word: string, emotion: string, context: { isQuestion: boolean; isReveal: boolean; isReflection: boolean; isFear: boolean; isHope: boolean }): SRKeywordEmphasis {
    let style: SREmphasisStyle = "bold";
    let color = "#FFFFFF";
    let scale = 1;

    if (context.isFear || emotion === "fear") {
      style = "accent_color";
      color = "#FF4444";
      scale = 1;
    } else if (context.isHope || emotion === "hope") {
      style = "accent_color";
      color = "#4488FF";
      scale = 1;
    } else if (context.isReveal) {
      style = "glow";
      color = "#FFD700";
      scale = 1.05;
    } else if (context.isQuestion) {
      style = "scale";
      color = "#FFFFFF";
      scale = 1.08;
    } else if (context.isReflection) {
      style = "glow";
      color = "#C0C0C0";
      scale = 1.02;
    }

    return { word, emotion, style, color, scale };
  }

  getStyleForEmotion(emotion: string): SREmphasisStyle {
    const map: Record<string, SREmphasisStyle> = {
      fear: "accent_color", hope: "accent_color", future: "glow",
      wonder: "scale", reflection: "glow", urgency: "bold", curiosity: "scale"
    };
    return map[emotion] ?? "bold";
  }
}
