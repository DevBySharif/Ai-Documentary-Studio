import { GenerationQueueScheduler } from "./generation-queue-scheduler";
import { CharacterConsistencyTracker } from "./character-consistency-tracker";
import { CandidateComparisonScoring } from "./candidate-comparison-scoring";
import { ImageApprovalAutolinker } from "./image-approval-autolinker";
import { BatchGenerationDashboard } from "./batch-generation-dashboard";

/**
 * Master AI Image Generation Workspace UI Engine (Main Vol 05 Part 09).
 * Orchestrates 4-panel visual production layout: Left Scenes/Shots Sidebar -> Center Generation Canvas -> Right Settings/Inspector -> Bottom Queue/Progress/Logs.
 */
export class MasterImageGenerationUI {
  public readonly queueScheduler = new GenerationQueueScheduler();
  public readonly consistencyTracker = new CharacterConsistencyTracker();
  public readonly comparisonScoring = new CandidateComparisonScoring();
  public readonly approvalAutolinker = new ImageApprovalAutolinker();
  public readonly batchDashboard = new BatchGenerationDashboard();

  public triggerShotGeneration(shotId: string, sceneId: string, promptText: string, triggerPhrase: string): { jobId: string; status: string } {
    const job = this.queueScheduler.addJob(shotId, sceneId, promptText, triggerPhrase);
    return {
      jobId: job.jobId,
      status: job.status,
    };
  }
}
