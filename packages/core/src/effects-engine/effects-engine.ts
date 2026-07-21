import { FrameIndex } from "../timeline-engine/time";
import { EffectModel } from "./effect-model";
import { EffectStack } from "./effect-stack";
import { ParameterGraph } from "./parameter-graph";
import { EffectRegistry } from "./effect-registry";

export interface EffectOutputContract {
  effect: string;
  frame: number;
  enabled: boolean;
  gpu: boolean;
  status: string;
}

/**
 * Master Effects Engine (IB Part 16).
 * Manages deterministic effect evaluation, parameter graphs, shader/effect caching,
 * and outputs structured telemetry.
 */
export class EffectsEngine {
  private readonly registry: EffectRegistry;
  private readonly paramGraph = new ParameterGraph();
  private shaderCache = new Map<string, string>();

  constructor(registry?: EffectRegistry) {
    this.registry = registry ?? new EffectRegistry();
  }

  public getRegistry(): EffectRegistry {
    return this.registry;
  }

  /**
   * Evaluates an effect stack deterministically for a given frame.
   */
  public evaluateEffectStack(
    stack: EffectStack,
    frame: FrameIndex
  ): ReadonlyArray<EffectOutputContract> {
    const contracts: EffectOutputContract[] = [];

    for (const effect of stack.effects) {
      if (!effect.enabled) {
        contracts.push(this.buildContract(effect, frame, "Skipped"));
        continue;
      }

      try {
        // Evaluate parameter graph for this frame
        this.paramGraph.evaluateForFrame(frame, (_paramName, _f) => undefined);

        contracts.push(this.buildContract(effect, frame, "Rendered"));
      } catch (err) {
        console.warn(`[EffectsEngine] Effect '${effect.name}' failed. Falling back.`, err);
        contracts.push(this.buildContract(effect, frame, "Bypassed"));
      }
    }

    return contracts;
  }

  /**
   * Section 20 Output Contract Generator
   */
  public buildContract(
    effect: EffectModel,
    frame: FrameIndex,
    status: "Rendered" | "Skipped" | "Bypassed"
  ): EffectOutputContract {
    return {
      effect: effect.name,
      frame,
      enabled: effect.enabled,
      gpu: effect.isGpuAccelerated,
      status,
    };
  }

  public clearShaderCache(): void {
    this.shaderCache.clear();
  }
}
