import type { EngineInput, EngineOutput, Decision } from "../types/engine.js";
import type { BaseEngine } from "../engine/base.js";

export interface PipelineStep {
  name: string;
  engine: BaseEngine;
  transformInput?: (data: Record<string, unknown>) => EngineInput;
  transformOutput?: (output: EngineOutput) => Record<string, unknown>;
}

export class DecisionPipeline {
  private steps: PipelineStep[] = [];
  private decisions: Decision[] = [];

  addStep(step: PipelineStep): void {
    this.steps.push(step);
  }

  getDecisions(): Decision[] {
    return [...this.decisions];
  }

  clearDecisions(): void {
    this.decisions = [];
  }

  async execute(initialInput: EngineInput): Promise<{
    success: boolean;
    outputs: EngineOutput[];
    decisions: Decision[];
  }> {
    const outputs: EngineOutput[] = [];
    let currentData: Record<string, unknown> = { ...initialInput.data };

    for (const step of this.steps) {
      const stepStart = performance.now();
      const input = step.transformInput
        ? step.transformInput(currentData)
        : { ...initialInput, data: currentData };

      const output = await step.engine.execute(input);
      outputs.push(output);

      const stepEnd = performance.now();

      const decision: Decision = {
        id: crypto.randomUUID(),
        engine: step.engine.name,
        action: step.name,
        input: input.data ?? {},
        options: [],
        selected: output.data,
        confidence: output.confidence,
        timestamp: new Date().toISOString(),
        duration: stepEnd - stepStart,
      };

      this.decisions.push(decision);

      if (!output.success) {
        return { success: false, outputs, decisions: this.decisions };
      }

      if (step.transformOutput) {
        currentData = step.transformOutput(output);
      } else {
        currentData = { ...currentData, ...output.data };
      }
    }

    return { success: true, outputs, decisions: this.decisions };
  }
}
