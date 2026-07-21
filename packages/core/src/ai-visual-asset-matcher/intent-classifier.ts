import { VisualIntentType, EmotionalTone } from "./matcher-types";

/**
 * Visual Intent & Emotion Analyzer (Vol 04 Part 05 - Section 6, Section 12).
 * Classifies narrative segments into visual intent types and emotional tones.
 */
export class IntentClassifier {
  public classifyIntent(text: string): VisualIntentType {
    if (text.includes("%") || text.includes("number") || text.includes("total")) {
      return "StatisticalInformation";
    }
    if (text.includes("in 1") || text.includes("during the year")) {
      return "HistoricalEvent";
    }
    if (text.includes("located in") || text.includes("river") || text.includes("mountain")) {
      return "GeographicLocation";
    }
    return "HistoricalEvent";
  }

  public detectEmotionalTone(text: string): EmotionalTone {
    if (text.includes("tragic") || text.includes("loss") || text.includes("war")) {
      return "Tragedy";
    }
    if (text.includes("hope") || text.includes("victory") || text.includes("built")) {
      return "Hope";
    }
    return "Discovery";
  }
}
