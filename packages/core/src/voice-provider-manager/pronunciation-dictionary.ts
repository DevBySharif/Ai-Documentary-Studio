import { VPPronunciationRule } from "./types";

export class VPPronunciationDictionary {
  private rules: Map<string, VPPronunciationRule[]> = new Map();

  addRule(rule: VPPronunciationRule): void {
    const key = rule.text.toLowerCase();
    const existing = this.rules.get(key) || [];
    existing.push({ ...rule });
    this.rules.set(key, existing);
  }

  removeRule(text: string): boolean {
    return this.rules.delete(text.toLowerCase());
  }

  findByText(text: string): VPPronunciationRule[] {
    const key = text.toLowerCase();
    const results = this.rules.get(key);
    return results ? results.map((r) => ({ ...r })) : [];
  }

  findByCategory(
    category: VPPronunciationRule["category"]
  ): VPPronunciationRule[] {
    const results: VPPronunciationRule[] = [];
    for (const rules of this.rules.values()) {
      for (const rule of rules) {
        if (rule.category === category) {
          results.push({ ...rule });
        }
      }
    }
    return results;
  }

  applyToScript(script: string): string {
    let result = script;
    for (const [, rules] of this.rules) {
      for (const rule of rules) {
        const escapedText = rule.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedText, "gi");
        result = result.replace(regex, rule.pronunciation);
      }
    }
    return result;
  }

  getAll(): VPPronunciationRule[] {
    const all: VPPronunciationRule[] = [];
    for (const rules of this.rules.values()) {
      for (const rule of rules) {
        all.push({ ...rule });
      }
    }
    return all;
  }

  clear(): void {
    this.rules.clear();
  }

  count(): number {
    let total = 0;
    for (const rules of this.rules.values()) {
      total += rules.length;
    }
    return total;
  }
}
