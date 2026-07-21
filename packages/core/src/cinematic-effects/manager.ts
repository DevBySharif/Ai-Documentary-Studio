import type { CEEffectStack, CEEffectQuality } from "./types.js";
import { CEEffectStackManager } from "./stack.js";
import { CEColorGradingEngine } from "./color-grade.js";
import { CEExposureEngine } from "./exposure.js";
import { CEContrastEngine } from "./contrast.js";
import { CEVignetteEngine } from "./vignette.js";
import { CEBloomEngine } from "./bloom.js";
import { CEDepthOfFieldEngine } from "./depth-of-field.js";
import { CEAtmosphereEngine } from "./atmosphere.js";
import { CEFilmGrainEngine } from "./grain.js";
import { CELensEffectsEngine } from "./lens.js";
import { CELightRaysEngine } from "./light-rays.js";
import { CEMotionBlurEngine } from "./motion-blur.js";
import { CETransitionEffects } from "./transitions.js";
import { CEAIColorist } from "./ai-colorist.js";
import { CEEffectsDirectorAI } from "./effects-director.js";
import { CEContinuityPreservationEngine } from "./continuity.js";
import { CEEffectSafetySystem } from "./safety.js";
import { CEEffectsValidator } from "./validation.js";

export class CECinematicEffectsEngine {
  readonly stackManager: CEEffectStackManager;
  readonly colorGrade: CEColorGradingEngine;
  readonly exposure: CEExposureEngine;
  readonly contrast: CEContrastEngine;
  readonly vignette: CEVignetteEngine;
  readonly bloom: CEBloomEngine;
  readonly depthOfField: CEDepthOfFieldEngine;
  readonly atmosphere: CEAtmosphereEngine;
  readonly grain: CEFilmGrainEngine;
  readonly lens: CELensEffectsEngine;
  readonly lightRays: CELightRaysEngine;
  readonly motionBlur: CEMotionBlurEngine;
  readonly transitions: CETransitionEffects;
  readonly aiColorist: CEAIColorist;
  readonly effectsDirector: CEEffectsDirectorAI;
  readonly continuity: CEContinuityPreservationEngine;
  readonly safety: CEEffectSafetySystem;
  readonly validator: CEEffectsValidator;

  constructor() {
    this.stackManager = new CEEffectStackManager();
    this.colorGrade = new CEColorGradingEngine();
    this.exposure = new CEExposureEngine();
    this.contrast = new CEContrastEngine();
    this.vignette = new CEVignetteEngine();
    this.bloom = new CEBloomEngine();
    this.depthOfField = new CEDepthOfFieldEngine();
    this.atmosphere = new CEAtmosphereEngine();
    this.grain = new CEFilmGrainEngine();
    this.lens = new CELensEffectsEngine();
    this.lightRays = new CELightRaysEngine();
    this.motionBlur = new CEMotionBlurEngine();
    this.transitions = new CETransitionEffects();
    this.aiColorist = new CEAIColorist();
    this.effectsDirector = new CEEffectsDirectorAI();
    this.continuity = new CEContinuityPreservationEngine();
    this.safety = new CEEffectSafetySystem();
    this.validator = new CEEffectsValidator();
  }

  buildStack(quality: CEEffectQuality, mood: string, emotion: string): CEEffectStack {
    const gradeConfig = this.aiColorist.analyze(mood, 0.7, 0.6, 0.8);
    const effectDecision = this.effectsDirector.decide(emotion, "hold", 0.5, 0.5, "cross_dissolve");

    const stack = this.stackManager.build({
      colorGrade: gradeConfig,
      lighting: { vignette: effectDecision.vignette, bloom: effectDecision.bloom, lightRays: 0 },
      filmGrain: { type: effectDecision.grain, intensity: 0.12 },
      atmosphere: effectDecision.atmosphere ? { type: effectDecision.atmosphere, intensity: 0.15, speed: 1 } : undefined
    });

    const safetyResult = this.safety.check(stack, { x: 0.1, y: 0.85, width: 0.8, height: 0.1 });
    return safetyResult.passed ? stack : this.safety.correct(stack, safetyResult);
  }
}
