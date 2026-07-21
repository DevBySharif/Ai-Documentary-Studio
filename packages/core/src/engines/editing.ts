import { BaseEngine } from "../engine/base.js";
import { EventBus } from "../event-bus/index.js";
import type { EngineInput, EngineOutput } from "../types/engine.js";

export class EditingEngine extends BaseEngine {
  constructor(eventBus: EventBus) {
    super("editing", "1.0.0", eventBus);
  }

  validate(input: EngineInput): boolean {
    return !!input.projectId && !!input.data?.scenes;
  }

  async process(input: EngineInput): Promise<EngineOutput> {
    return {
      success: true,
      confidence: 0.85,
      data: { editingPlan: [] },
      warnings: [],
      errors: [],
    };
  }
}
