import { AiReasoningEngine } from "./ai-reasoning-engine";
import { ContextMemoryWindowManager } from "./context-memory-window-manager";
import { MultiModelCollaborationOrchestrator } from "./multi-model-collaboration-orchestrator";
import { AiExecutionPipeline } from "./ai-execution-pipeline";
import { AiSessionTraceTracker } from "./ai-session-trace-tracker";
import { AiCapabilityCategory } from "./ai-platform-types";

/**
 * Master AI Platform Intelligence Engine (Main Vol 07 Part 01).
 * Core entry point for capability-driven AI execution. Orchestrates high-level reasoning, 3-tier memory context assembly, multi-model collaboration, 8-stage pipelines, and session trace tracking.
 */
export class MasterAiPlatformIntelligence {
  public readonly reasoningEngine = new AiReasoningEngine();
  public readonly contextMemoryManager = new ContextMemoryWindowManager();
  public readonly collaborationOrchestrator = new MultiModelCollaborationOrchestrator();
  public readonly executionPipeline = new AiExecutionPipeline();
  public readonly sessionTracker = new AiSessionTraceTracker();

  public async executeCapabilityWorkflow<T = unknown>(
    projectId: string,
    capability: AiCapabilityCategory,
    rawPrompt: string
  ): Promise<{ result: T; sessionId: string; stagesCount: number }> {
    const session = this.sessionTracker.startSession(projectId, capability);
    const plan = this.reasoningEngine.formulateReasoningPlan(capability);
    const context = this.contextMemoryManager.assembleOptimalContext(rawPrompt);
    const pipelineRes = await this.executionPipeline.runPipeline<T>(projectId, capability, context.finalContextText);

    return {
      result: pipelineRes.result,
      sessionId: session.sessionId,
      stagesCount: pipelineRes.stagesCompletedCount,
    };
  }
}
