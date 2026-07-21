export class SRMultiLanguageSupport {
  private directionMap: Record<string, "ltr" | "rtl"> = {
    ar: "rtl", he: "rtl", ur: "rtl", fa: "rtl",
    en: "ltr", bn: "ltr", hi: "ltr", es: "ltr", fr: "ltr"
  };

  getDirection(lang: string): "ltr" | "rtl" {
    return this.directionMap[lang.toLowerCase()] ?? "ltr";
  }

  getTextAlign(lang: string): "left" | "right" {
    return this.getDirection(lang) === "rtl" ? "right" : "left";
  }

  getFontFallback(lang: string): string {
    const map: Record<string, string> = {
      bn: "Noto Sans Bengali, sans-serif",
      ar: "Noto Naskh Arabic, serif",
      he: "Noto Sans Hebrew, sans-serif",
      ur: "Noto Nastaliq Urdu, serif",
      fa: "Noto Naskh Arabic, serif",
      hi: "Noto Sans Devanagari, sans-serif",
      ja: "Noto Sans JP, sans-serif",
      zh: "Noto Sans SC, sans-serif",
      ko: "Noto Sans KR, sans-serif"
    };
    return map[lang.toLowerCase()] ?? "Inter, sans-serif";
  }

  getLanguageName(code: string): string {
    const names: Record<string, string> = {
      en: "English", bn: "Bangla", ar: "Arabic", he: "Hebrew",
      ur: "Urdu", fa: "Persian", hi: "Hindi", es: "Spanish",
      fr: "French", ja: "Japanese", zh: "Chinese", ko: "Korean"
    };
    return names[code.toLowerCase()] ?? code;
  }
}
