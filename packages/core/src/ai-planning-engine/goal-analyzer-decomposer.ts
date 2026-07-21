import { DecomposedTaskItem } from "./planning-types";

/**
 * Goal Analyzer & Task Decomposer (Vol 07 Part 03 - Section 4, Section 5, Section 6).
 * Analyzes high-level documentary goals and decomposes them into atomic executable tasks.
 */
export class GoalAnalyzerDecomposer {
  public analyzeGoal(primaryGoal: string): {
    primaryObjective: string;
    targetDurationMins: number;
    requiredPhases: ReadonlyArray<string>;
  } {
    const isMidway = primaryGoal.toLowerCase().includes("battle of midway") || primaryGoal.toLowerCase().includes("midway");
    return {
      primaryObjective: primaryGoal,
      targetDurationMins: isMidway ? 15 : 10,
      requiredPhases: ["Research", "Script", "Storyboard", "Prompts", "Images", "Voice", "Timeline", "Review"],
    };
  }

  public decomposeIntoAtomicTasks(primaryGoal: string): ReadonlyArray<DecomposedTaskItem> {
    return [
      { taskId: "tsk_res_1", taskName: "Historical Research & Fact Collection", category: "Research", capabilityRequired: "Research", prerequisiteTaskIds: [], isParallelizable: false, requiresHumanApprovalGate: false },
      { taskId: "tsk_script_1", taskName: "Documentary Script Writing", category: "Writing", capabilityRequired: "Writing", prerequisiteTaskIds: ["tsk_res_1"], isParallelizable: false, requiresHumanApprovalGate: true },
      { taskId: "tsk_sb_1", taskName: "Storyboard Shot Planning", category: "Writing", capabilityRequired: "Writing", prerequisiteTaskIds: ["tsk_script_1"], isParallelizable: false, requiresHumanApprovalGate: true },
      { taskId: "tsk_prompt_1", taskName: "Visual Prompt Compilation", category: "Writing", capabilityRequired: "PromptOptimization", prerequisiteTaskIds: ["tsk_sb_1"], isParallelizable: true, requiresHumanApprovalGate: false },
      { taskId: "tsk_img_1", taskName: "AI Image Production", category: "VisualGeneration", capabilityRequired: "ImageGeneration", prerequisiteTaskIds: ["tsk_prompt_1"], isParallelizable: true, requiresHumanApprovalGate: true },
      { taskId: "tsk_voice_1", taskName: "Narration Speech Synthesis", category: "AudioGeneration", capabilityRequired: "VoiceSynthesis", prerequisiteTaskIds: ["tsk_script_1"], isParallelizable: true, requiresHumanApprovalGate: true },
      { taskId: "tsk_tl_1", taskName: "Timeline NLE Assembly", category: "Editing", capabilityRequired: "Editing", prerequisiteTaskIds: ["tsk_img_1", "tsk_voice_1"], isParallelizable: false, requiresHumanApprovalGate: false },
      { taskId: "tsk_rev_1", taskName: "Final Documentary Review & Quality Gate", category: "Review", capabilityRequired: "FactChecking", prerequisiteTaskIds: ["tsk_tl_1"], isParallelizable: false, requiresHumanApprovalGate: true },
    ];
  }
}
