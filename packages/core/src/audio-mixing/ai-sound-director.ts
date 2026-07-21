import type { AMSceneContext, AMAISoundDirectorDecision } from "./types.js";

export class AMAISoundDirector {
  evaluate(context: AMSceneContext): AMAISoundDirectorDecision {
    const decision: AMAISoundDirectorDecision = {
      musicLevel: -10,
      ambienceIntensity: -15,
      duckingDepth: 10,
      transitionSounds: false,
      dynamicRange: 6
    };

    const lower = context.emotion;

    if (lower === "reflection") {
      decision.musicLevel = -16;
      decision.ambienceIntensity = -18;
      decision.duckingDepth = 8;
      decision.dynamicRange = 4;
    } else if (lower === "discovery") {
      decision.musicLevel = -8;
      decision.ambienceIntensity = -14;
      decision.duckingDepth = 10;
      decision.dynamicRange = 8;
      decision.transitionSounds = true;
    } else if (lower === "tension") {
      decision.musicLevel = -12;
      decision.ambienceIntensity = -12;
      decision.duckingDepth = 12;
      decision.dynamicRange = 3;
    } else if (lower === "revelation") {
      decision.musicLevel = -6;
      decision.ambienceIntensity = -16;
      decision.duckingDepth = 8;
      decision.dynamicRange = 10;
      decision.transitionSounds = true;
    } else if (lower === "hope") {
      decision.musicLevel = -8;
      decision.ambienceIntensity = -15;
      decision.duckingDepth = 8;
      decision.dynamicRange = 8;
    } else if (lower === "fear") {
      decision.musicLevel = -14;
      decision.ambienceIntensity = -10;
      decision.duckingDepth = 14;
      decision.dynamicRange = 4;
    } else if (lower === "wonder") {
      decision.musicLevel = -10;
      decision.ambienceIntensity = -16;
      decision.duckingDepth = 8;
      decision.dynamicRange = 8;
    } else if (lower === "calm") {
      decision.musicLevel = -14;
      decision.ambienceIntensity = -18;
      decision.duckingDepth = 6;
      decision.dynamicRange = 4;
    } else if (lower === "urgency") {
      decision.musicLevel = -6;
      decision.ambienceIntensity = -12;
      decision.duckingDepth = 12;
      decision.dynamicRange = 10;
    }

    if (context.narrationIntensity > 0.7) {
      decision.musicLevel -= 3;
      decision.duckingDepth += 3;
    }

    if (context.cameraMovement === "fast") {
      decision.musicLevel += 2;
      decision.dynamicRange += 2;
    } else if (context.cameraMovement === "static") {
      decision.musicLevel -= 2;
    }

    if (context.silenceDuration > 3000) {
      decision.musicLevel -= 2;
      decision.ambienceIntensity -= 2;
    }

    return decision;
  }
}
