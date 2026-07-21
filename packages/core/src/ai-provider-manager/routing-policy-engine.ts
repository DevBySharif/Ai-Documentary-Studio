import type { APRouteRule, APTaskType, APProviderName } from "./types.js";

export class APRoutingPolicyEngine {
  private policies: Map<string, (task: APTaskType, budget: number, latency: number, capabilities: string[]) => APRouteRule> = new Map();

  addPolicy(name: string, fn: (task: APTaskType, budget: number, latency: number, capabilities: string[]) => APRouteRule): void {
    this.policies.set(name, fn);
  }

  evaluate(task: APTaskType, budget: number, latencyTarget: number, requiredCapabilities: string[]): APRouteRule | undefined {
    for (const [, policy] of this.policies) {
      const result = policy(task, budget, latencyTarget, requiredCapabilities);
      if (result) return result;
    }
    return undefined;
  }
}
