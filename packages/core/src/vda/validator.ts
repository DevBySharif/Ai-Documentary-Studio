import type { ScenePrompt } from "../prompt/types.js";
import type { VisualDNAProfile } from "./types.js";
import { ConsistencyEngine, type ConsistencyCheck } from "./consistency.js";

export interface VisualValidationReport {
  passed: boolean;
  score: number;
  checks: ConsistencyCheck[];
  approvedForLibrary: boolean;
}

export class VisualValidator {
  private consistencyEngine: ConsistencyEngine;

  constructor() {
    this.consistencyEngine = new ConsistencyEngine();
  }

  validatePrompts(prompts: ScenePrompt[], vda: VisualDNAProfile): VisualValidationReport {
    const checks = this.consistencyEngine.check(prompts, vda);
    const score = this.consistencyEngine.score(checks);
    const passed = this.consistencyEngine.allPass(checks);
    const approvedForLibrary = score >= 85;

    return {
      passed,
      score,
      checks,
      approvedForLibrary,
    };
  }

  validateSinglePrompt(prompt: ScenePrompt, vda: VisualDNAProfile): ConsistencyCheck[] {
    return this.consistencyEngine.check([prompt], vda);
  }
}
