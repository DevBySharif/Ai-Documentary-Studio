import { AgentRegistryManager } from "./agent-registry-manager";
import { AgentMemoryContextIsolator } from "./agent-memory-context-isolator";
import { AgentConflictResolutionEngine } from "./agent-conflict-resolution-engine";
import { CollaborativeReviewLoopOrchestrator } from "./collaborative-review-loop-orchestrator";
import { AgentCommunicationArtifact, SpecializedAgentRole } from "./agent-types";

/**
 * Master Multi-Agent Collaboration Engine (Main Vol 07 Part 07).
 * Central coordinator orchestrating communication, structured artifact exchanges, dynamic agent selection, conflict resolution, and collaborative review loops.
 */
export class MasterMultiAgentCollaboration {
  public readonly registryManager = new AgentRegistryManager();
  public readonly memoryIsolator = new AgentMemoryContextIsolator();
  public readonly conflictEngine = new AgentConflictResolutionEngine();
  public readonly reviewLoopOrchestrator = new CollaborativeReviewLoopOrchestrator();

  private artifactHistory: AgentCommunicationArtifact[] = [];

  public dispatchArtifact(
    senderRole: SpecializedAgentRole,
    recipientRole: SpecializedAgentRole,
    artifactType: string,
    payloadObj: unknown
  ): AgentCommunicationArtifact {
    const sender = this.registryManager.findAgentByRole(senderRole);
    const recipient = this.registryManager.findAgentByRole(recipientRole);

    const artifact: AgentCommunicationArtifact = {
      artifactId: `art_${Math.random().toString(36).substring(2, 7)}`,
      senderAgentId: sender ? sender.agentId : `agt_${senderRole.toLowerCase()}`,
      recipientAgentId: recipient ? recipient.agentId : `agt_${recipientRole.toLowerCase()}`,
      artifactType,
      payloadJson: JSON.stringify(payloadObj),
      timestamp: new Date(),
    };

    this.artifactHistory.push(artifact);
    return artifact;
  }
}
