import type { AIntEmotionSegment, AIntSentence } from "./types.js";

export class AIntEmotionDetector {
  detect(sentences: AIntSentence[]): AIntEmotionSegment[] {
    return sentences.map((s) => {
      const emotion = this.classifyEmotion(s.text);
      return {
        start: s.start,
        end: s.end,
        emotion,
        confidence: 0.7 + Math.random() * 0.2
      };
    });
  }

  private classifyEmotion(text: string): AIntEmotionSegment["emotion"] {
    const lower = text.toLowerCase();
    if (lower.includes("why") || lower.includes("how") || lower.includes("what")) return "curiosity";
    if (lower.includes("imagine") || lower.includes("perhaps") || lower.includes("maybe")) return "wonder";
    if (lower.includes("fear") || lower.includes("danger") || lower.includes("threat")) return "fear";
    if (lower.includes("hope") || lower.includes("dream") || lower.includes("future")) return "hope";
    if (lower.includes("reflect") || lower.includes("think") || lower.includes("remember")) return "reflection";
    if (lower.includes("urgent") || lower.includes("immediately") || lower.includes("must")) return "urgency";
    return "neutral";
  }

  getDominantEmotion(segments: AIntEmotionSegment[]): AIntEmotionSegment["emotion"] {
    if (segments.length === 0) return "neutral";
    const counts: Record<string, number> = {};
    for (const s of segments) {
      counts[s.emotion] = (counts[s.emotion] ?? 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as AIntEmotionSegment["emotion"];
  }
}
