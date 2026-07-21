import type { EditingPreset, MotionClip, MotionTimeline, MotionValidationReport } from "./types.js";
import { EmotionMotionMap } from "./emotion-motion.js";
import { HoldEngine } from "./hold.js";
import { ZoomPanEngine } from "./zoom-pan.js";
import { ParallaxEngine } from "./parallax.js";
import { WordEmphasisMotionEngine } from "./word-emphasis.js";
import { CinematicTransitionEngine } from "./transitions.js";
import { RhythmEngine, VisualBreathing } from "./rhythm.js";
import { MotionValidator, EffectEngine } from "./validation.js";
import { WhisperSyncEngine } from "./whisper.js";
import { PresetManager } from "./presets.js";
import { createZennMotionProfile } from "./zenn.js";
import type { EmotionTag } from "../story/types.js";

export class EditingDNAManager {
  private presetManager: PresetManager;
  private activePreset: EditingPreset;
  private emotionMap: EmotionMotionMap;
  private holdEngine: HoldEngine;
  private zoomPan: ZoomPanEngine;
  private parallax: ParallaxEngine;
  private wordEmphasis: WordEmphasisMotionEngine;
  private transition: CinematicTransitionEngine;
  private rhythm: RhythmEngine;
  private breathing: VisualBreathing;
  private validator: MotionValidator;
  private effects: EffectEngine;
  public whisperSync: WhisperSyncEngine;
  private presetName: string;

  constructor(presetName?: string) {
    this.presetManager = new PresetManager();
    this.activePreset = this.loadPreset(presetName);
    this.presetName = this.activePreset.name;

    this.emotionMap = new EmotionMotionMap(this.activePreset.emotionMotionMap);
    this.holdEngine = new HoldEngine(this.activePreset.holdRule);
    this.zoomPan = new ZoomPanEngine(this.activePreset.zoomRule, this.activePreset.panRule);
    this.parallax = new ParallaxEngine(this.activePreset.parallax);
    this.wordEmphasis = new WordEmphasisMotionEngine(this.activePreset.wordEmphasis);
    this.transition = new CinematicTransitionEngine(this.activePreset.transitions);
    this.rhythm = new RhythmEngine(this.activePreset.rhythm);
    this.breathing = new VisualBreathing(this.activePreset.breathing);
    this.validator = new MotionValidator({
      minSceneDuration: 1.0,
      maxSceneDuration: 15,
      voiceTimingTolerance: 0.2,
      minImageQuality: 0.7,
      cropSafetyMargin: 0.05,
      faceSafetyMargin: 0.1,
      objectSafetyMargin: 0.05,
      subtitleSafeBottom: 0.9,
      subtitleSafeTop: 0.1,
    });
    this.effects = new EffectEngine(this.activePreset.effects);
    this.whisperSync = new WhisperSyncEngine();
  }

  private loadPreset(name?: string): EditingPreset {
    if (!name) return createZennMotionProfile();
    return this.presetManager.get(name) || createZennMotionProfile();
  }

  switchPreset(name: string): void {
    this.activePreset = this.loadPreset(name);
    this.presetName = this.activePreset.name;
    this.emotionMap = new EmotionMotionMap(this.activePreset.emotionMotionMap);
    this.zoomPan = new ZoomPanEngine(this.activePreset.zoomRule, this.activePreset.panRule);
    this.parallax = new ParallaxEngine(this.activePreset.parallax);
    this.wordEmphasis = new WordEmphasisMotionEngine(this.activePreset.wordEmphasis);
    this.transition = new CinematicTransitionEngine(this.activePreset.transitions);
    this.rhythm = new RhythmEngine(this.activePreset.rhythm);
    this.breathing = new VisualBreathing(this.activePreset.breathing);
    this.effects = new EffectEngine(this.activePreset.effects);
  }

  getPresetName(): string {
    return this.presetName;
  }

  generateTimeline(
    sceneEmotions: Array<{ sceneIndex: number; emotion: EmotionTag; duration: number; importance: number; purpose: string }>,
    emphasisWords: Array<{ word: string; start: number; end: number }>
  ): MotionTimeline {
    const clips: MotionClip[] = [];
    let totalDuration = 0;

    for (const scene of sceneEmotions) {
      const motionRule = this.emotionMap.get(scene.emotion);
      const holdDuration = this.holdEngine.calculate(
        Math.round(scene.duration * 3),
        scene.importance,
        0.5,
        this.emotionMap.getHoldModifier(scene.emotion)
      );

      const transitionStyle = this.transition.selectTransitionForScene(scene.purpose, scene.emotion);

      const primaryClip: MotionClip = {
        scene: scene.sceneIndex,
        motion: motionRule.motion,
        start: totalDuration,
        end: totalDuration + holdDuration,
        easing: "ease_in_out",
        intensity: motionRule.intensity,
        emotion: scene.emotion,
        transition: transitionStyle,
        transitionDuration: 0.5,
      };

      clips.push(primaryClip);

      const breathClips = this.breathing.generateBreathingClips(
        scene.sceneIndex,
        scene.emotion,
        holdDuration
      );
      clips.push(...breathClips);

      const wordClips = this.wordEmphasis.generateClips(
        emphasisWords,
        scene.sceneIndex,
        scene.emotion
      );
      clips.push(...wordClips);

      totalDuration += holdDuration;
    }

    clips.sort((a, b) => a.start - b.start);

    const report = this.validator.validate(clips, totalDuration);

    return {
      clips,
      totalDuration: Math.round(totalDuration * 10) / 10,
      metadata: {
        preset: this.presetName,
        generatedAt: new Date().toISOString(),
        validated: report.overall >= 70,
        validationScore: report.overall,
      },
    };
  }

  validateTimeline(timeline: MotionTimeline): MotionValidationReport {
    return this.validator.validate(timeline.clips, timeline.totalDuration);
  }
}
