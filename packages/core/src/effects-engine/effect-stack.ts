import { EffectModel } from "./effect-model";

/**
 * Ordered Stack of Effects attached to a clip (IB Part 16 - Section 5).
 * Execution order is deterministic and user-visible.
 */
export interface EffectStack {
  readonly clipId: string;
  readonly effects: ReadonlyArray<EffectModel>;
}

export function createEffectStack(clipId: string): EffectStack {
  return { clipId, effects: [] };
}

export function addEffectToStack(stack: EffectStack, effect: EffectModel): EffectStack {
  return { ...stack, effects: [...stack.effects, effect] };
}

export function removeEffectFromStack(stack: EffectStack, effectId: string): EffectStack {
  return { ...stack, effects: stack.effects.filter((e) => e.id !== effectId) };
}

export function reorderEffectInStack(
  stack: EffectStack,
  effectId: string,
  newIndex: number
): EffectStack {
  const index = stack.effects.findIndex((e) => e.id === effectId);
  if (index === -1) return stack;

  const updated = [...stack.effects];
  const [removed] = updated.splice(index, 1);
  updated.splice(newIndex, 0, removed);

  return { ...stack, effects: updated };
}

export function toggleEffectInStack(stack: EffectStack, effectId: string): EffectStack {
  const updated = stack.effects.map((e) =>
    e.id === effectId ? { ...e, enabled: !e.enabled, version: e.version + 1 } : e
  );
  return { ...stack, effects: updated };
}
