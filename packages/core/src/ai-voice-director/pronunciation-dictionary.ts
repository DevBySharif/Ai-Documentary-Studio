export interface PronunciationOverride {
  readonly term: string;
  readonly ipaSpelling: string; // International Phonetic Alphabet or simplified respelling
  readonly category: "ForeignName" | "Scientific" | "Historical" | "Geographic";
}

/**
 * Pronunciation Dictionary Manager (Vol 04 Part 08 - Section 11).
 * Custom project dictionary for terms requiring pronunciation guidance.
 */
export class PronunciationDictionary {
  private customDictionary = new Map<string, PronunciationOverride>();

  constructor() {
    this.initDefaults();
  }

  private initDefaults(): void {
    const defaults: PronunciationOverride[] = [
      { term: "Geneva", ipaSpelling: "dʒɪˈniːvə", category: "Geographic" },
      { term: "Versailles", ipaSpelling: "vɛərˈsaɪ", category: "Geographic" },
    ];
    defaults.forEach((d) => this.customDictionary.set(d.term.toLowerCase(), d));
  }

  public registerOverride(override: PronunciationOverride): void {
    this.customDictionary.set(override.term.toLowerCase(), override);
  }

  public getOverride(term: string): PronunciationOverride | undefined {
    return this.customDictionary.get(term.toLowerCase());
  }
}
