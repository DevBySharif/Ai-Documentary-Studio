import type { VisualIntent } from "./types.js";

export class VisualIntentDetector {
  detect(
    isQuestion: boolean,
    isReveal: boolean,
    isMetaphor: boolean,
    importance: number,
    emotion: string,
    text: string
  ): VisualIntent {
    if (isReveal) return "reveal";
    if (isQuestion) return "question";
    if (isMetaphor) return "symbolize";
    if (importance >= 8) return "emphasize";

    const compareWords = ["unlike", "similar", "different", "compared", "versus", "vs"];
    if (compareWords.some((w) => text.toLowerCase().includes(w))) return "compare";

    const recallWords = ["remember", "recall", "earlier", "previously", "before"];
    if (recallWords.some((w) => text.toLowerCase().includes(w))) return "recall";

    const transitionWords = ["now", "next", "finally", "meanwhile", "however", "therefore"];
    if (transitionWords.some((w) => text.toLowerCase().includes(w))) return "transition";

    return "explain";
  }
}
