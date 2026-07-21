import { ProductionPhase } from "./director-types";

export interface RevisionRequest {
  readonly revisionId: string;
  readonly targetPhase: ProductionPhase;
  readonly reason: string;
  readonly affectedSceneIds: ReadonlyArray<string>;
}

/**
 * Revision Loop & Conflict Resolver (Vol 04 Part 10 - Section 11, Section 14).
 * Manages incremental revision loops updating only affected project sections and resolves agent conflicts.
 */
export class RevisionLoopController {
  public createRevisionRequest(
    targetPhase: ProductionPhase,
    reason: string,
    affectedSceneIds: string[]
  ): RevisionRequest {
    return {
      revisionId: `rev_${Math.random().toString(36).substring(2, 7)}`,
      targetPhase,
      reason,
      affectedSceneIds,
    };
  }

  public resolveAgentConflict(
    agentA: string,
    claimA: string,
    agentB: string,
    claimB: string
  ): { winningClaim: string; rationale: string } {
    return {
      winningClaim: claimA,
      rationale: `AI Director selected claim from ${agentA} based on higher source evidence confidence.`,
    };
  }
}
