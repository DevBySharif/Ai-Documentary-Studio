import { DirectorTask, ProductionPhase, SpecializedAgentRole } from "./director-types";

/**
 * Multi-Agent Task Delegator (Vol 04 Part 10 - Section 5, Section 6).
 * Coordinates tasks across 9 specialized agents: Research, Writing, Storyboard, Prompt, Image, Voice, Timeline, Review, Quality.
 */
export class AgentDelegator {
  public delegatePhaseTasks(phase: ProductionPhase): ReadonlyArray<DirectorTask> {
    const roleMapping: Record<ProductionPhase, SpecializedAgentRole> = {
      TopicDefinition: "ReviewAgent",
      ProductionPlanning: "QualityAgent",
      Research: "ResearchAgent",
      Writing: "WritingAgent",
      Storyboard: "StoryboardAgent",
      AssetGeneration: "ImageAgent",
      Narration: "VoiceAgent",
      TimelineComposition: "TimelineAgent",
      Review: "ReviewAgent",
      Approval: "QualityAgent",
      FinalProduction: "QualityAgent",
    };

    const role = roleMapping[phase];
    return [
      {
        taskId: `tsk_${phase}_${Math.random().toString(36).substring(2, 7)}`,
        phase,
        assignedAgent: role,
        taskDescription: `Execute ${phase} pipeline deliverables under AI Director supervision.`,
        isCompleted: false,
      },
    ];
  }
}
