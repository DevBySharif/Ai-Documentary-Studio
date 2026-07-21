import type { MRMotionPreset, MRCameraPath, MRCinematographerDecision, MRCameraRhythmReport, MRAdaptiveComplexity } from "./types.js";
import { MRMotionTypeRegistry } from "./motion-types.js";
import { MRMultiStageCamera } from "./multi-stage.js";
import { MRCameraCurveEngine } from "./curve.js";
import { MRMotionSmoothing } from "./smoothing.js";
import { MRCameraInertiaEngine } from "./inertia.js";
import { MRVelocityController } from "./velocity.js";
import { MRSubjectFollowMode } from "./subject-follow.js";
import { MRKenBurnsEngine } from "./ken-burns.js";
import { MRParallaxEngine } from "./parallax.js";
import { MRMotionBlending } from "./blending.js";
import { MRMotionPhysics } from "./physics.js";
import { MRMotionLimiter } from "./limiter.js";
import { MRMotionEventTimeline } from "./event-timeline.js";
import { MRFrameInterpolation } from "./interpolation.js";
import { MRAICinematographer } from "./cinematographer.js";
import { MRCameraRhythmEngine } from "./rhythm.js";
import { MRAdaptiveMotionIntelligence } from "./adaptive.js";
import { MRMotionValidator } from "./validation.js";

export class MRMotionRenderingEngine {
  readonly registry: MRMotionTypeRegistry;
  readonly multiStage: MRMultiStageCamera;
  readonly curves: MRCameraCurveEngine;
  readonly smoothing: MRMotionSmoothing;
  readonly inertia: MRCameraInertiaEngine;
  readonly velocity: MRVelocityController;
  readonly subjectFollow: MRSubjectFollowMode;
  readonly kenBurns: MRKenBurnsEngine;
  readonly parallax: MRParallaxEngine;
  readonly blending: MRMotionBlending;
  readonly physics: MRMotionPhysics;
  readonly limiter: MRMotionLimiter;
  readonly events: MRMotionEventTimeline;
  readonly interpolation: MRFrameInterpolation;
  readonly cinematographer: MRAICinematographer;
  readonly rhythm: MRCameraRhythmEngine;
  readonly adaptive: MRAdaptiveMotionIntelligence;
  readonly validator: MRMotionValidator;

  constructor() {
    this.registry = new MRMotionTypeRegistry();
    this.multiStage = new MRMultiStageCamera();
    this.curves = new MRCameraCurveEngine();
    this.smoothing = new MRMotionSmoothing();
    this.inertia = new MRCameraInertiaEngine();
    this.velocity = new MRVelocityController();
    this.subjectFollow = new MRSubjectFollowMode();
    this.kenBurns = new MRKenBurnsEngine();
    this.parallax = new MRParallaxEngine();
    this.blending = new MRMotionBlending();
    this.physics = new MRMotionPhysics();
    this.limiter = new MRMotionLimiter();
    this.events = new MRMotionEventTimeline();
    this.interpolation = new MRFrameInterpolation();
    this.cinematographer = new MRAICinematographer();
    this.rhythm = new MRCameraRhythmEngine();
    this.adaptive = new MRAdaptiveMotionIntelligence();
    this.validator = new MRMotionValidator();
  }

  planMotion(sceneIndex: number, duration: number, subjectX: number, subjectY: number, subjectW: number, subjectH: number, scriptMeaning: string, emotion: string, previousMotion: MRMotionPreset | null): MRCinematographerDecision {
    const decision = this.cinematographer.select(sceneIndex, scriptMeaning, emotion, 0.7, previousMotion, "");
    return decision;
  }

  generatePath(decision: MRCinematographerDecision, totalFrames: number): MRCameraPath {
    const dur = this.registry.getDefaultDuration(decision.selectedMotion);
    this.multiStage.clear();
    this.multiStage.addSegment(decision.selectedMotion, 0, totalFrames, "ease_in_out", {});
    return { segments: this.multiStage.getSegments(), totalDuration: dur, totalFrames };
  }

  getRhythmReport(totalScenes: number): MRCameraRhythmReport {
    return this.rhythm.analyze(totalScenes);
  }

  getComplexity(sceneDuration: number, subjectCount: number, visualDensity: number, emotionLevel: number, narrationSpeed: number, subtitleDensity: number): MRAdaptiveComplexity {
    return this.adaptive.calculate(sceneDuration, subjectCount, visualDensity, emotionLevel, narrationSpeed, subtitleDensity);
  }
}
