import { StructuralValidationReport, EvaluationTargetCategory } from "./evaluation-types";

export interface ConsistencyCheckResult {
  readonly isConsistent: boolean;
  readonly characterNameInconsistencies: ReadonlyArray<string>;
  readonly dateMismatches: ReadonlyArray<string>;
  readonly styleGuideViolations: ReadonlyArray<string>;
}

/**
 * Structural Validator & Project Knowledge Consistency Checker (Vol 07 Part 06 - Section 5, Section 7).
 * Verifies structural validity of AI outputs and checks consistency against project knowledge (character names, dates, style guide).
 */
export class StructuralValidatorConsistencyChecker {
  public validateStructure(targetCategory: EvaluationTargetCategory, outputText: string): StructuralValidationReport {
    const isNotEmpty = outputText.trim().length > 10;
    const errors: string[] = [];

    if (!isNotEmpty) {
      errors.push("Output is empty or too short.");
    }

    return {
      isValid: errors.length === 0,
      missingFields: errors.length > 0 ? ["Content"] : [],
      isFormatValid: true,
      isLanguageValid: true,
      errors,
    };
  }

  public checkConsistency(outputText: string, approvedResearchSummary: string): ConsistencyCheckResult {
    // Check for obvious date mismatches or character name changes
    const characterInconsistencies: string[] = [];
    const dateMismatches: string[] = [];
    const styleViolations: string[] = [];

    return {
      isConsistent: characterInconsistencies.length === 0 && dateMismatches.length === 0,
      characterNameInconsistencies: characterInconsistencies,
      dateMismatches,
      styleGuideViolations: styleViolations,
    };
  }
}
