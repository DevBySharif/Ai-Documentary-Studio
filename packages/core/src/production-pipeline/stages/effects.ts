import type { EffectConfig } from "../types.js";

export class EffectsBuilder {
  private readonly availableEffects: EffectConfig["type"][] = [
    "fade", "blur", "glow", "light_rays", "depth_blur", "vignette", "noise", "grain", "color_grade"
  ];

  apply(channelDNA: Record<string, unknown>, sceneCount: number): EffectConfig[][] {
    const style: string = (channelDNA?.visualStyle as string) ?? "cinematic";
    const effectsPerScene: EffectConfig[][] = [];

    for (let i = 0; i < sceneCount; i++) {
      const effects: EffectConfig[] = [];

      effects.push({ type: "fade", intensity: 0.3, duration: 15 });
      effects.push({ type: "vignette", intensity: 0.2, duration: 0 });

      if (style === "cinematic") {
        effects.push({ type: "color_grade", intensity: 0.5, duration: 0 });
        effects.push({ type: "depth_blur", intensity: 0.1, duration: 0 });
      }

      effectsPerScene.push(effects);
    }

    return effectsPerScene;
  }

  getAvailable(): EffectConfig["type"][] {
    return [...this.availableEffects];
  }
}
