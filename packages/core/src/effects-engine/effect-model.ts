export type EffectCategory =
  | "Transform"
  | "Color"
  | "Blur"
  | "Sharpen"
  | "Stylization"
  | "Distortion"
  | "Lighting"
  | "Masking"
  | "Audio"
  | "AI"
  | "Utility";

export type BlendMode =
  | "Normal"
  | "Multiply"
  | "Screen"
  | "Overlay"
  | "SoftLight"
  | "HardLight"
  | "Add"
  | "Subtract"
  | "Difference";

export type ParameterValue = number | string | boolean | number[];

export interface ParameterDefinition {
  readonly name: string;
  readonly type: "number" | "string" | "boolean" | "color" | "vec2" | "vec4";
  readonly defaultValue: ParameterValue;
  readonly minValue?: number;
  readonly maxValue?: number;
  readonly step?: number;
  readonly isAnimatable: boolean;
}

export interface AnimationBinding {
  readonly parameterName: string;
  readonly keyframeTrackId: string;
}

/**
 * Immutable Effect Model (IB Part 16 - Section 4).
 * Parameter changes produce new effect state instances.
 */
export interface EffectModel {
  readonly id: string;
  readonly type: string;
  readonly name: string;
  readonly category: EffectCategory;
  readonly enabled: boolean;
  readonly parameters: ReadonlyMap<string, ParameterValue>;
  readonly animationBindings: ReadonlyArray<AnimationBinding>;
  readonly blendMode: BlendMode;
  readonly isGpuAccelerated: boolean;
  readonly version: number;
}

export function createEffectModel(
  type: string,
  name: string,
  category: EffectCategory,
  initialParams: Record<string, ParameterValue> = {},
  blendMode: BlendMode = "Normal",
  isGpuAccelerated = true
): EffectModel {
  const parameters = new Map<string, ParameterValue>(Object.entries(initialParams));
  return {
    id: `fx_${Math.random().toString(36).substring(2, 9)}`,
    type,
    name,
    category,
    enabled: true,
    parameters,
    animationBindings: [],
    blendMode,
    isGpuAccelerated,
    version: 1,
  };
}
