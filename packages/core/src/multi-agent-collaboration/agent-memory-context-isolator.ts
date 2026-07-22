/**
 * Agent Isolated Memory & Context Filter (Vol 07 Part 07 - Section 9, Section 11).
 * Isolates working/session memory per agent to prevent context overload and assigns explicit task ownership.
 */
export class AgentMemoryContextIsolator {
  private agentMemories = new Map<string, Map<string, string>>();

  public setAgentWorkingMemory(agentId: string, key: string, value: string): void {
    if (!this.agentMemories.has(agentId)) {
      this.agentMemories.set(agentId, new Map());
    }
    this.agentMemories.get(agentId)!.set(key, value);
  }

  public getAgentContext(agentId: string): Record<string, string> {
    const mem = this.agentMemories.get(agentId);
    if (!mem) return {};
    const obj: Record<string, string> = {};
    mem.forEach((v, k) => {
      obj[k] = v;
    });
    return obj;
  }
}
