import { AgentConflictRecord } from "./agent-types";

/**
 * Agent Conflict Resolution Engine (Vol 07 Part 07 - Section 10).
 * Detects disagreements between specialized agents (e.g. Research vs Fact Checking) and applies resolution strategies.
 */
export class AgentConflictResolutionEngine {
  private conflictHistory: AgentConflictRecord[] = [];

  public resolveConflict(
    claimingAgentIds: string[],
    topic: string,
    agentClaimA: { agentId: string; claim: string; confidenceScore: number },
    agentClaimB: { agentId: string; claim: string; confidenceScore: number }
  ): AgentConflictRecord {
    let resolvedValue = agentClaimA.claim;
    let strategy: AgentConflictRecord["resolutionStrategy"] = "ConfidenceComparison";

    if (agentClaimB.confidenceScore > agentClaimA.confidenceScore) {
      resolvedValue = agentClaimB.claim;
    }

    const record: AgentConflictRecord = {
      conflictId: `cfl_${Math.random().toString(36).substring(2, 7)}`,
      claimingAgentIds,
      topic,
      conflictDetails: `Conflict between ${agentClaimA.agentId} ("${agentClaimA.claim}") and ${agentClaimB.agentId} ("${agentClaimB.claim}")`,
      resolutionStrategy: strategy,
      resolvedValue,
      timestamp: new Date(),
    };

    this.conflictHistory.push(record);
    return record;
  }
}
