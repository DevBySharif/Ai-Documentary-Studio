import type { MotionClip, MotionTimeline, MotionValidationReport, Whispersync } from "./types.js";
import { EditingDNAManager } from "./editor.js";
import type { EmotionTag } from "../story/types.js";
import type { StoryScript } from "../story/types.js";

export interface SceneMotionInput {
  sceneIndex: number;
  emotion: EmotionTag;
  duration: number;
  importance: number;
  purpose: string;
}

export class CinematicMotionEngine {
  private editingDNA: EditingDNAManager;

  constructor(presetName?: string) {
    this.editingDNA = new EditingDNAManager(presetName);
  }

  getEditingDNA(): EditingDNAManager {
    return this.editingDNA;
  }

  loadWhisperSync(sync: Whispersync): void {
    this.editingDNA.whisperSync.load(sync);
  }

  generateFromScript(
    script: StoryScript,
    emotionOverrides?: Map<number, EmotionTag>
  ): MotionTimeline {
    const sceneInputs: SceneMotionInput[] = script.scenes.map((scene) => ({
      sceneIndex: scene.sceneNumber,
      emotion: emotionOverrides?.get(scene.sceneNumber) || scene.emotion,
      duration: scene.estimatedDuration,
      importance: scene.importance,
      purpose: scene.purpose,
    }));

    const emphasisWords = script.semanticSegments.flatMap((seg) =>
      seg.sentences.flatMap((s) =>
        s.emphasisWords.map((w) => ({
          word: w,
          start: 0,
          end: 0,
        }))
      )
    );

    return this.editingDNA.generateTimeline(sceneInputs, emphasisWords);
  }

  generateFromInputs(
    scenes: SceneMotionInput[],
    emphasisWords: Array<{ word: string; start: number; end: number }>
  ): MotionTimeline {
    return this.editingDNA.generateTimeline(scenes, emphasisWords);
  }

  validate(timeline: MotionTimeline): MotionValidationReport {
    return this.editingDNA.validateTimeline(timeline);
  }
}
