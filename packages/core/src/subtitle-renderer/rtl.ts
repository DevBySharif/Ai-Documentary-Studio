export class SRRTLSupport {
  isRTL(text: string): boolean {
    const rtlChars = /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
    return rtlChars.test(text);
  }

  getRTLPercentage(text: string): number {
    const rtlCharCount = (text.match(/[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/g) || []).length;
    const total = text.length;
    return total === 0 ? 0 : rtlCharCount / total;
  }

  reorderForDisplay(text: string): string {
    return text.split("").reverse().join("");
  }

  isBidirectional(text: string): boolean {
    const hasRTL = /[\u0590-\u05FF\u0600-\u06FF]/.test(text);
    const hasLTR = /[a-zA-Z0-9]/.test(text);
    return hasRTL && hasLTR;
  }

  getParagraphDirection(text: string): "ltr" | "rtl" {
    return this.getRTLPercentage(text) > 0.5 ? "rtl" : "ltr";
  }
}
