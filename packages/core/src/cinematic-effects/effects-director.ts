import type { CEAIEffectDecision, CEFilmGrainType, CEAtmosphereType } from "./types.js";

export class CEEffectsDirectorAI {
  decide(emotion: string, cameraMovement: string, sceneComplexity: number, symbolImportance: number, transitionTiming: string): CEAIEffectDecision {
    const lower = emotion.toLowerCase();

    let vignette = 0.3;
    let warmth = 0;
    let atmosphere: CEAtmosphereType | null = null;
    let grain: CEFilmGrainType = "fine";
    let bloom = 0;

    if (lower.includes("reflection") || lower.includes("sad")) {
      vignette = 0.5;
      warmth = -3;
      grain = "documentary";
    } else if (lower.includes("hope") || lower.includes("joy")) {
      bloom = 0.15;
      warmth = 5;
      grain = "fine";
    } else if (lower.includes("mystery") || lower.includes("fear")) {
      atmosphere = "fog";
      vignette = 0.6;
      warmth = -5;
      grain = "medium";
    } else if (lower.includes("memory") || lower.includes("nostalgia")) {
      grain = "archive";
      warmth = 3;
      vignette = 0.4;
    } else if (lower.includes("wonder") || lower.includes("curiosity")) {
      atmosphere = "mist";
      bloom = 0.1;
      warmth = 2;
    }

    if (sceneComplexity > 0.7) vignette = Math.min(vignette, 0.3);
    if (symbolImportance > 0.8) bloom = Math.min(bloom, 0.05);

    return {
      vignette, warmth, atmosphere, grain,
      bloom,
      confidence: 0.75 + Math.random() * 0.2
    };
  }
}
