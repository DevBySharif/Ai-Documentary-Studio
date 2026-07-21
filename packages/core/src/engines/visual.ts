import { BaseEngine } from "../engine/base.js";
import { EventBus } from "../event-bus/index.js";
import type { EngineInput, EngineOutput } from "../types/engine.js";

export class VisualEngine extends BaseEngine {
  constructor(eventBus: EventBus) {
    super("visual", "1.0.0", eventBus);
  }

  validate(input: EngineInput): boolean {
    return !!input.projectId && !!input.data?.scenes;
  }

  async process(input: EngineInput): Promise<EngineOutput> {
    return {
      success: true,
      confidence: 0.85,
      data: { visualPlan: {} },
      warnings: [],
      errors: [],
    };
  }
}
