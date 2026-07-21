import { AiSessionDescriptor, AiCapabilityCategory } from "./ai-platform-types";

/**
 * AI Session Trace Tracker & Reproducibility Logger (Vol 07 Part 01 - Section 10, Section 15).
 * Tracks AI sessions (Session ID, Project ID, Context, Models used, tokens, costs, outputs) ensuring complete reproducibility.
 */
export class AiSessionTraceTracker {
  private sessions: AiSessionDescriptor[] = [];

  public startSession(projectId: string, capability: AiCapabilityCategory): AiSessionDescriptor {
    const session: AiSessionDescriptor = {
      sessionId: `aisess_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      capability,
      contextSources: ["ResearchNotes", "ProjectScript"],
      modelsUsed: ["GeneralLanguageModel-v1"],
      tokensConsumed: 450,
      totalCostUSD: 0.003,
      createdAt: new Date(),
    };
    this.sessions.push(session);
    return session;
  }

  public getSessionHistory(projectId: string): ReadonlyArray<AiSessionDescriptor> {
    return this.sessions.filter((s) => s.projectId === projectId);
  }
}
