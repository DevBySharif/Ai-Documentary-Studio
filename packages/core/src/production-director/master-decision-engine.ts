import type { PDDecision, PDDecisionRequest, PDDecisionResult, PDEngineType } from "./types.js";

export class PDMasterDecisionEngine {
  evaluate(request: PDDecisionRequest): PDDecisionResult {
    let decision: PDDecision = "approve";
    let reason = "All checks passed";
    let requiresRegen = false;
    const affected: PDEngineType[] = [request.engine];

    if (request.context === "qa_failure") {
      decision = "regenerate";
      reason = "QA detected issues requiring regeneration";
      requiresRegen = true;
    } else if (request.context === "dna_mismatch") {
      decision = "reject";
      reason = "Output violates Channel DNA";
      affected.push("prompt", "image_approval");
    } else if (request.context === "continuity_break") {
      decision = "adjust";
      reason = "Continuity break detected, adjusting parameters";
    }

    return { decision, reason, requiresRegeneration: requiresRegen, affectedEngines: affected };
  }

  isApproved(result: PDDecisionResult): boolean {
    return result.decision === "approve";
  }
}
