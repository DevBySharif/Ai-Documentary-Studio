import type { DNASection } from "./types.js";

export class DNADiffViewer {
  diff(oldDNA: DNASection, newDNA: DNASection): Array<{ section: string; changed: boolean; changes: string[] }> {
    const results: Array<{ section: string; changed: boolean; changes: string[] }> = [];
    const sections = Object.keys(oldDNA) as (keyof DNASection)[];

    for (const section of sections) {
      const changes: string[] = [];
      const oldVal = JSON.stringify(oldDNA[section]);
      const newVal = JSON.stringify(newDNA[section]);

      if (oldVal !== newVal) {
        changes.push(`Section "${section}" modified`);
        results.push({ section, changed: true, changes });
      } else {
        results.push({ section, changed: false, changes: [] });
      }
    }

    return results;
  }
}
