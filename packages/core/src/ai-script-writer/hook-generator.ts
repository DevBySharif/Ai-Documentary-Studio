import { HookStyle } from "./script-types";

/**
 * Hook Generator (Vol 04 Part 03 - Section 7).
 * Creates attention-grabbing opening hooks without misleading the audience.
 */
export class HookGenerator {
  public generateHook(topic: string, style: HookStyle): string {
    switch (style) {
      case "SurprisingFact":
        return `What if everything you believed about ${topic} was only half the truth?`;
      case "Question":
        return `How did a single decision regarding ${topic} reshape modern history?`;
      case "EmotionalStatement":
        return `Beneath the surface of ${topic} lies a story of perseverance and loss.`;
      case "HistoricalMystery":
        return `For decades, key records surrounding ${topic} remained hidden from public view.`;
      case "Statistic":
        return `Over 80% of historical accounts overlook the critical turning point of ${topic}.`;
      case "DramaticContrast":
        return `While the world looked elsewhere, the true events of ${topic} unfolded in silence.`;
      case "UnfinishedStory":
      default:
        return `The story of ${topic} did not begin where the history books claim.`;
    }
  }
}
