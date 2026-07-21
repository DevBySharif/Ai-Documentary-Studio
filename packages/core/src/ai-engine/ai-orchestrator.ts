import { CapabilityRegistry } from "./capability-registry";
import { ModelRouter } from "./model-router";
import { PromptPipeline } from "./prompt-pipeline";
import { ToolExecutor } from "./tool-executor";
import { AiJobScheduler } from "./ai-job-scheduler";
import { TokenCostTracker } from "./token-cost-tracker";
import { TaskType } from "./model-router";

export interface AiOutputContract {
  jobId: string;
  provider: string;
  model: string;
  agent: string;
  tokens: number;
  status: string;
}

/**
 * Master AI Orchestrator (IB Part 18).
 * Coordinates capability registry, model router, prompt pipeline, tools, scheduler, and cost tracking.
 */
export class AiOrchestrator {
  public readonly capabilityRegistry = new CapabilityRegistry();
  public readonly modelRouter = new ModelRouter(this.capabilityRegistry);
  public readonly toolExecutor = new ToolExecutor();
  public readonly scheduler = new AiJobScheduler();
  public readonly costTracker = new TokenCostTracker();

  public createPromptPipeline(): PromptPipeline {
    return new PromptPipeline();
  }

  public async runTaskWorkflow(
    taskType: TaskType,
    agentName: string,
    userTask: string,
    contextBlocks: Array<{ name: string; content: string }> = []
  ): Promise<AiOutputContract> {
    // 1. Select Model via Router
    const model = this.modelRouter.route({ taskType });

    // 2. Schedule Job
    const job = this.scheduler.createJob(model.providerName, model.modelId, agentName);
    this.scheduler.updateJobState(job.jobId, "Running");

    // 3. Build Prompt
    const pipeline = this.createPromptPipeline()
      .setSystemRole(`Specialized ${agentName}`, ["Be concise and factual."]);

    contextBlocks.forEach((cb) => pipeline.addContextBlock(cb.name, cb.content));
    pipeline.setTaskPrompt(userTask);

    const fullUserPrompt = pipeline.buildUserPrompt();
    const estInputTokens = this.costTracker.estimateTokens(fullUserPrompt);
    const estOutputTokens = 500;

    // 4. Record Usage
    this.costTracker.recordUsage(
      job.jobId,
      model.providerName,
      model.modelId,
      estInputTokens,
      estOutputTokens,
      model.costPer1kInputTokensUsd,
      model.costPer1kOutputTokensUsd
    );

    // 5. Complete Job
    const totalTokens = estInputTokens + estOutputTokens;
    this.scheduler.updateJobState(job.jobId, "Completed", totalTokens);

    return this.getOutputContract(job.jobId);
  }

  /**
   * Section 19 Output Contract Generator
   */
  public getOutputContract(jobId: string): AiOutputContract {
    const job = this.scheduler.getJob(jobId);
    if (!job) {
      throw new Error(`[AiOrchestrator] Job not found: ${jobId}`);
    }

    return {
      jobId: job.jobId,
      provider: job.providerName,
      model: job.modelId,
      agent: job.agentName,
      tokens: job.tokensConsumed,
      status: job.state,
    };
  }
}
