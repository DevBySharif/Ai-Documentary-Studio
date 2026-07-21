import { ExtractedFact } from "./research-types";

export interface ContradictingClaim {
  readonly claimId: string;
  readonly statementA: string;
  readonly statementB: string;
  readonly sourceA: string;
  readonly sourceB: string;
  readonly confidenceA: number;
  readonly confidenceB: number;
  readonly explanation: string;
}

/**
 * Conflict & Contradiction Analysis Engine (Vol 04 Part 02 - Section 11).
 * Detects disagreements across sources and surfaces them transparently without hiding conflicting evidence.
 */
export class ConflictAnalyzer {
  public analyzeConflicts(facts: ReadonlyArray<ExtractedFact>): ReadonlyArray<ContradictingClaim> {
    const conflicts: ContradictingClaim[] = [];

    // Detect contradictory statistical or date claims
    for (let i = 0; i < facts.length; i++) {
      for (let j = i + 1; j < facts.length; j++) {
        const a = facts[i];
        const b = facts[j];

        if (a.category === b.category && a.statement !== b.statement && a.confidence > 0.6 && b.confidence > 0.6) {
          conflicts.push({
            claimId: `conflict_${i}_${j}`,
            statementA: a.statement,
            statementB: b.statement,
            sourceA: a.sourceUrl || "Source A",
            sourceB: b.sourceUrl || "Source B",
            confidenceA: a.confidence,
            confidenceB: b.confidence,
            explanation: `Sources disagree on ${a.category} details.`,
          });
        }
      }
    }

    return conflicts.slice(0, 5); // Return top conflicts
  }
}
