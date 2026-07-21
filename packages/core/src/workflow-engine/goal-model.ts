export type PriorityLevel = "Low" | "Medium" | "High" | "Urgent";

/**
 * Structured Production Goal Model (IB Part 20 - Section 4).
 * Goals remain immutable once workflow execution begins.
 */
export interface ProductionGoal {
  readonly goalId: string;
  readonly documentaryTopic: string;
  readonly targetDurationMinutes: number;
  readonly style: string; // e.g. "Cinematic", "Historical Narrative", "Investigative"
  readonly audience: string;
  readonly language: string;
  readonly outputRequirements: ReadonlyArray<string>;
  readonly priority: PriorityLevel;
  readonly createdAt: Date;
}

export function createProductionGoal(
  topic: string,
  targetDurationMinutes: number,
  style = "Cinematic Narrative",
  audience = "General",
  language = "en-US",
  outputRequirements: string[] = ["1080p", "StereoAudio"],
  priority: PriorityLevel = "Medium"
): ProductionGoal {
  return {
    goalId: `goal_${Math.random().toString(36).substring(2, 9)}`,
    documentaryTopic: topic,
    targetDurationMinutes,
    style,
    audience,
    language,
    outputRequirements,
    priority,
    createdAt: new Date(),
  };
}
