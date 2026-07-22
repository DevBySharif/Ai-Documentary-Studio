import { AgentDescriptor, SpecializedAgentRole } from "./agent-types";

/**
 * Extensible Agent Registry & Dynamic Selection Engine (Vol 07 Part 07 - Section 4, Section 5, Section 13, Section 16).
 * Registers specialized agents, manages capabilities, and selects optimal agents based on task type and performance.
 */
export class AgentRegistryManager {
  private registry = new Map<string, AgentDescriptor>();

  constructor() {
    this.initDefaultAgents();
  }

  private initDefaultAgents(): void {
    const roles: SpecializedAgentRole[] = [
      "ResearchAgent",
      "OutlineAgent",
      "ScriptAgent",
      "FactVerificationAgent",
      "PromptEngineeringAgent",
      "StoryboardAgent",
      "ImageDirectionAgent",
      "NarrationAgent",
      "TranslationAgent",
      "ReviewAgent",
    ];

    roles.forEach((role) => {
      const agent: AgentDescriptor = {
        agentId: `agt_${role.toLowerCase()}_1`,
        role,
        capabilities: [role.replace("Agent", "")],
        preferredModels: ["StandardLanguageModel"],
        version: "1.0.0",
        status: "Active",
      };
      this.registry.set(agent.agentId, agent);
    });
  }

  public registerAgent(agent: AgentDescriptor): void {
    this.registry.set(agent.agentId, agent);
  }

  public findAgentByRole(role: SpecializedAgentRole): AgentDescriptor | undefined {
    return Array.from(this.registry.values()).find((a) => a.role === role);
  }

  public listAgents(): ReadonlyArray<AgentDescriptor> {
    return Array.from(this.registry.values());
  }
}
