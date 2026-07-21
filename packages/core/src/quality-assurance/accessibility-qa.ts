import type { QAAccessibilityReport } from "./types.js";

export class QAAccessibilityQA {
  analyze(contrast: number, fontSize: number, readingSpeed: number, colorAccess: number, mobileVis: number): QAAccessibilityReport {
    const overall = Math.round((contrast + fontSize + readingSpeed + colorAccess + mobileVis) / 5 * 100);

    return {
      subtitleContrast: contrast,
      fontSize,
      readingSpeed,
      colorAccessibility: colorAccess,
      mobileVisibility: mobileVis,
      overall,
      passed: overall >= 70
    };
  }

  isAccessible(report: QAAccessibilityReport): boolean {
    return report.passed;
  }
}
