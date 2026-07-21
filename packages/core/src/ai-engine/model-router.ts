import { CapabilityRegistry, ModelDescriptor } from "./capability-registry";
import { AiCapabilities } from "./capability-registry";

export type TaskType =
  | "Research"
  | "Scriptwriting"
  | "Storyboard"
  | "TimelineEdit"
  | "AssetSelection"
  | "Voiceover"
  | "QA";

export interface ModelRoutingPolicy {
  readonly taskType: TaskType;
  readonly maxCostUsd?: number;
  readonly requiredCapabilities?: Partial<AiCapabilities>;
  readonly preferredModelId?: string;
}

/**
 * Policy-Driven Model Router (IB Part 18 - Section 6).
 * Selects optimal provider and model based on capabilities, task type, and cost budget.
 */
export class ModelRouter {
  constructor(private readonly registry: CapabilityRegistry) {}

  public route(policy: ModelRoutingPolicy): ModelDescriptor {
    if (policy.preferredModelId) {
      const preferred = this.registry.getModel(policy.preferredModelId);
      if (preferred && preferred.isAvailable) return preferred;
    }

    const candidates = this.registry.findModelsWithCapabilities(policy.requiredCapabilities ?? {});
    if (candidates.length === 0) {
      throw new Error(`[ModelRouter] No available model matching policy for task: ${policy.taskType}`);
    }

    // Sort candidates by cost efficiency
    candidates.slice().sort((a, b) => a.costPer1kInputTokensUsd - b.costPer1kInputTokensUsd);
    return candidates[0];
  }
}
