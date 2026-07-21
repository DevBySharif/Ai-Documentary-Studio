import { FrameIndex } from "../timeline-engine/time";
import { ParameterValue } from "./effect-model";

export interface ParameterNode {
  readonly parameterName: string;
  readonly value: ParameterValue;
  readonly isDirty: boolean;
  readonly dependencies: ReadonlyArray<string>;
}

/**
 * Parameter Graph for incremental recomputation and shared animation evaluation (IB Part 16 - Section 21).
 * Evaluates parameter values for a specific frame, invalidating only modified parameters.
 */
export class ParameterGraph {
  private nodes = new Map<string, ParameterNode>();

  public setParameter(name: string, value: ParameterValue, dependencies: string[] = []): void {
    this.nodes.set(name, {
      parameterName: name,
      value,
      isDirty: true,
      dependencies,
    });
  }

  public getEvaluatedValue(name: string): ParameterValue | undefined {
    return this.nodes.get(name)?.value;
  }

  public evaluateForFrame(frame: FrameIndex, animationEvaluator: (name: string, f: FrameIndex) => ParameterValue | undefined): void {
    for (const [name, node] of Array.from(this.nodes.entries())) {
      const animatedVal = animationEvaluator(name, frame);
      if (animatedVal !== undefined && animatedVal !== node.value) {
        this.nodes.set(name, { ...node, value: animatedVal, isDirty: true });
      }
    }
  }

  public markClean(): void {
    for (const [name, node] of Array.from(this.nodes.entries())) {
      if (node.isDirty) {
        this.nodes.set(name, { ...node, isDirty: false });
      }
    }
  }
}
