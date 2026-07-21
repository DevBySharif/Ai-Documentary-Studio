import { PromptIntelligenceEngine, type PIEInput } from "./pi.js";
import type { PromptPlan } from "./types.js";

export class PromptManager {
  private engine: PromptIntelligenceEngine;
  private plans = new Map<string, PromptPlan>();

  constructor() {
    this.engine = new PromptIntelligenceEngine();
  }

  generate(input: PIEInput): PromptPlan {
    const plan = this.engine.generate(input);
    this.plans.set(plan.metadata.id, plan);
    return plan;
  }

  get(id: string): PromptPlan | undefined {
    return this.plans.get(id);
  }

  approve(id: string): boolean {
    const plan = this.plans.get(id);
    if (!plan) return false;
    if (plan.metadata.validated) {
      plan.storyboard.approved = true;
      return true;
    }
    return false;
  }
}
