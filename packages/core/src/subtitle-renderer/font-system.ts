export interface SRFontConfig {
  family: string;
  weight: number;
  size: number;
  color: string;
  accentColor: string;
  lineHeight: number;
  letterSpacing: number;
}

export class SRFontSystem {
  private supportedLanguages = ["english", "bangla", "arabic", "hindi", "japanese", "chinese", "korean"];

  private fonts: Map<string, SRFontConfig> = new Map();

  constructor() {
    this.fonts.set("documentary", { family: "Inter, sans-serif", weight: 400, size: 28, color: "#FFFFFF", accentColor: "#FFD700", lineHeight: 1.3, letterSpacing: 0.5 });
    this.fonts.set("educational", { family: "Noto Sans, sans-serif", weight: 500, size: 30, color: "#FFFFFF", accentColor: "#00BFFF", lineHeight: 1.4, letterSpacing: 0.3 });
    this.fonts.set("cinematic", { family: "Playfair Display, serif", weight: 400, size: 26, color: "#F5F5F5", accentColor: "#C0A060", lineHeight: 1.2, letterSpacing: 1 });
  }

  getFont(style: string): SRFontConfig | undefined {
    return this.fonts.get(style);
  }

  getDefault(): SRFontConfig {
    return this.fonts.get("documentary")!;
  }

  getFontForLanguage(language: string): string {
    const map: Record<string, string> = {
      english: "Inter, sans-serif",
      bangla: "Noto Sans Bengali, sans-serif",
      arabic: "Noto Naskh Arabic, serif",
      hindi: "Noto Sans Devanagari, sans-serif",
      japanese: "Noto Sans JP, sans-serif",
      chinese: "Noto Sans SC, sans-serif",
      korean: "Noto Sans KR, sans-serif"
    };
    return map[language.toLowerCase()] ?? "Inter, sans-serif";
  }

  isLanguageSupported(language: string): boolean {
    return this.supportedLanguages.includes(language.toLowerCase());
  }

  getSupportedLanguages(): string[] {
    return [...this.supportedLanguages];
  }
}
