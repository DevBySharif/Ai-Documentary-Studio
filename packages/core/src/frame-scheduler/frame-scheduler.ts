import type { FSFramerate, FSTransitionType, FSEventType, FMFrameState, FSOutputContract, FSValidationResult, FSAITimingDecision, FSCheckpoint } from "./types.js";
import { FSMasterClock } from "./master-clock.js";
import { FMFrameTimelineGenerator } from "./frame-timeline.js";
import { FSEventScheduler } from "./event-scheduler.js";
import { FSAudioSynchronizer } from "./audio-sync.js";
import { FSMotionSynchronizer } from "./motion-sync.js";
import { FSSubtitleSynchronizer } from "./subtitle-sync.js";
import { FSEffectSynchronizer } from "./effect-sync.js";
import { FSTransitionScheduler } from "./transition-scheduler.js";
import { FSRenderBatching } from "./render-batching.js";
import { FSFrameCache } from "./frame-cache.js";
import { FSKeyframeManager } from "./keyframe-manager.js";
import { FSTimelineResampler } from "./timeline-resampler.js";
import { FSTimingCorrectionEngine } from "./timing-correction.js";
import { FSZennTimingProfile } from "./zenn-timing-profile.js";
import { FSAITimingController } from "./ai-timing-controller.js";
import { FSGlobalEventBus } from "./global-event-bus.js";
import { FFFrameRecoveryEngine } from "./frame-recovery.js";
import { FSAdaptiveFrameDistributor } from "./adaptive-distributor.js";
import { FSFrameSchedulerValidator } from "./validator.js";
import { FSOutputContractBuilder } from "./output-contract.js";

export class FSFrameSchedulerEngine {
  readonly clock: FSMasterClock;
  readonly frameTimeline: FMFrameTimelineGenerator;
  readonly eventScheduler: FSEventScheduler;
  readonly audioSync: FSAudioSynchronizer;
  readonly motionSync: FSMotionSynchronizer;
  readonly subtitleSync: FSSubtitleSynchronizer;
  readonly effectSync: FSEffectSynchronizer;
  readonly transitionScheduler: FSTransitionScheduler;
  readonly renderBatching: FSRenderBatching;
  readonly frameCache: FSFrameCache;
  readonly keyframeManager: FSKeyframeManager;
  readonly resampler: FSTimelineResampler;
  readonly timingCorrection: FSTimingCorrectionEngine;
  readonly zennProfile: FSZennTimingProfile;
  readonly aiTiming: FSAITimingController;
  readonly eventBus: FSGlobalEventBus;
  readonly recovery: FFFrameRecoveryEngine;
  readonly distributor: FSAdaptiveFrameDistributor;
  readonly validator: FSFrameSchedulerValidator;
  readonly outputContract: FSOutputContractBuilder;

  constructor() {
    this.clock = new FSMasterClock();
    this.frameTimeline = new FMFrameTimelineGenerator();
    this.eventScheduler = new FSEventScheduler();
    this.audioSync = new FSAudioSynchronizer();
    this.motionSync = new FSMotionSynchronizer();
    this.subtitleSync = new FSSubtitleSynchronizer();
    this.effectSync = new FSEffectSynchronizer();
    this.transitionScheduler = new FSTransitionScheduler();
    this.renderBatching = new FSRenderBatching();
    this.frameCache = new FSFrameCache();
    this.keyframeManager = new FSKeyframeManager();
    this.resampler = new FSTimelineResampler();
    this.timingCorrection = new FSTimingCorrectionEngine();
    this.zennProfile = new FSZennTimingProfile();
    this.aiTiming = new FSAITimingController();
    this.eventBus = new FSGlobalEventBus();
    this.recovery = new FFFrameRecoveryEngine();
    this.distributor = new FSAdaptiveFrameDistributor();
    this.validator = new FSFrameSchedulerValidator();
    this.outputContract = new FSOutputContractBuilder();
  }

  applyZennDefaults(): void {
    const fps = this.zennProfile.getDefaultFPS();
    this.clock.setFPS(fps);
  }

  tick(): FMFrameState {
    const clockState = this.clock.tick();
    const frame = this.frameTimeline.generateFrame(clockState.frame, clockState.timestamp, clockState.sceneId);
    this.eventBus.publish("FrameStarted", frame, clockState.frame);
    return frame;
  }

  scheduleTransition(type: FSTransitionType, startFrame: number, durationMs: number): string {
    const durationFrames = this.resampler.convertDuration(durationMs, this.clock.getState().fps);
    return this.transitionScheduler.schedule(type, startFrame, durationFrames);
  }

  getContract(totalFrames: number): FSOutputContract {
    return this.outputContract.build(
      this.clock.getState().fps,
      totalFrames,
      this.eventScheduler.getEventCount(),
      this.timingCorrection.getDriftLog().length === 0,
      true
    );
  }
}
