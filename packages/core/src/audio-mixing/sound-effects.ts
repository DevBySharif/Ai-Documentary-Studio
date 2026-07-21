import type { AMSoundEffectConfig, AMSoundEffectType } from "./types.js";

export class AMSoundEffectsEngine {
  private effects: Map<string, AMSoundEffectConfig> = new Map();

  private presets: Record<AMSoundEffectType, AMSoundEffectConfig> = {
    whoosh: { type: "whoosh", volume: -10, timing: { start: 0, end: 500 } },
    transition: { type: "transition", volume: -8, timing: { start: 0, end: 300 } },
    impact: { type: "impact", volume: -6, timing: { start: 0, end: 200 } },
    click: { type: "click", volume: -12, timing: { start: 0, end: 50 } },
    page_turn: { type: "page_turn", volume: -10, timing: { start: 0, end: 400 } },
    light_atmosphere: { type: "light_atmosphere", volume: -16, timing: { start: 0, end: 2000 } }
  };

  getPreset(type: AMSoundEffectType): AMSoundEffectConfig {
    return { ...this.presets[type] };
  }

  scheduleEffect(id: string, config: AMSoundEffectConfig): void {
    this.effects.set(id, { ...config });
  }

  triggerEffect(type: AMSoundEffectType): AMSoundEffectConfig {
    return this.getPreset(type);
  }

  getScheduledEffects(): Map<string, AMSoundEffectConfig> {
    return new Map(this.effects);
  }

  clearEffects(): void {
    this.effects.clear();
  }

  removeEffect(id: string): boolean {
    return this.effects.delete(id);
  }
}
