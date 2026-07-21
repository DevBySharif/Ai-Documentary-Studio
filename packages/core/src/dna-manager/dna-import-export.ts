import type { DNASection } from "./types.js";

export class DNAImportExport {
  exportToJSON(dna: DNASection): string {
    return JSON.stringify(dna, null, 2);
  }

  importFromJSON(json: string): DNASection | null {
    try {
      return JSON.parse(json) as DNASection;
    } catch {
      return null;
    }
  }

  validateImport(dna: DNASection): boolean {
    const required = ["identity", "storyRules", "scriptRules", "promptRules", "artStyle", "motionRules", "subtitleRules", "qaRules", "exportRules"];
    return required.every((key) => key in dna);
  }
}
