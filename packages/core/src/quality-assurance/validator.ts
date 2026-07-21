import type { QAValidationResult } from "./types.js";

export class QAAssuranceValidator {
  validate(visual: boolean, audio: boolean, subtitle: boolean, motion: boolean, timeline: boolean, exportIntegrity: boolean): QAValidationResult {
    return { visual, audio, subtitle, motion, timeline, exportIntegrity, passed: visual && audio && subtitle && motion && timeline && exportIntegrity };
  }

  printReport(result: QAValidationResult): string[] {
    const lines: string[] = [];
    for (const [key, value] of Object.entries(result)) {
      if (key === "passed") continue;
      const status = value ? "✓" : "✗";
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
      lines.push(`${status} ${label}`);
    }
    return lines;
  }
}
