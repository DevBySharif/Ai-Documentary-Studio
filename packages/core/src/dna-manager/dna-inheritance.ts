import type { DNASection } from "./types.js";

export class DNAInheritanceEngine {
  inherit(base: DNASection, child: Partial<DNASection>): DNASection {
    const result: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(child)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        result[key] = { ...(result[key] as Record<string, unknown>), ...(value as Record<string, unknown>) };
      } else if (value !== undefined) {
        result[key] = value;
      }
    }
    return result as unknown as DNASection;
  }
}
