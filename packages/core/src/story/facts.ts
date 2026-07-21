import type { FactType } from "./types.js";

const FACT_PREFIXES: Record<FactType, string[]> = {
  verified_fact: [
    "Studies show that",
    "Research confirms",
    "Scientists have found",
    "Data reveals",
    "According to experts",
  ],
  interpretation: [
    "This suggests that",
    "What this means is",
    "The implication is",
    "This tells us",
  ],
  analogy: [
    "Think of it like",
    "It's similar to",
    "Imagine",
    "Compare this to",
  ],
  hypothesis: [
    "Some researchers believe",
    "It's possible that",
    "One theory suggests",
    "This could mean",
  ],
  opinion: [
    "In our view",
    "We believe",
    "The best approach is",
  ],
};

export class FactHandler {
  getPrefix(factType: FactType): string {
    const prefixes = FACT_PREFIXES[factType];
    return prefixes[Math.floor(Math.random() * prefixes.length)];
  }

  isUnsupportedAsFact(factType: FactType): boolean {
    return factType === "opinion" || factType === "hypothesis";
  }

  wrap(text: string, factType: FactType): string {
    if (text.startsWith("Let's") || text.startsWith("This is why")) return text;
    if (factType === "analogy") return text;
    if (factType === "hypothesis" || factType === "opinion") {
      return `${this.getPrefix(factType)} ${text[0].toLowerCase() + text.slice(1)}`;
    }
    return text;
  }
}
