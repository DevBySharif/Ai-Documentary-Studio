import type { TimelineBlock, TimelineMarker, TimelineBlockPriority } from "./types.js";
import type { StoryScript } from "../story/types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";
import { TimelineClock } from "./clock.js";

interface SemanticMoment {
  time: number;
  scene: number;
  concept: string;
  emotion: string;
  importance: number;
  isConceptShift: boolean;
  isEmotionShift: boolean;
  word: string;
  text: string;
}

export class SemanticTimelineEngine {
  private clock: TimelineClock;

  constructor(clock: TimelineClock) {
    this.clock = clock;
  }

  buildSemanticMap(script: StoryScript, audio: AudioIntelligenceResult): SemanticMoment[] {
    this.clock.setAudioSource(audio);
    const moments: SemanticMoment[] = [];
    let lastConcept = "";
    let lastEmotion = "";
    let currentTime = 0;

    for (const scene of script.scenes) {
      for (const sentence of scene.narration) {
        const concept = String(sentence.concepts[0] ?? scene.keyConcept);
        const emotion = String(sentence.emotion);
        const estDuration = sentence.estimatedDuration;

        moments.push({
          time: this.clock.alignToAudio(currentTime),
          scene: scene.sceneNumber,
          concept,
          emotion,
          importance: scene.importance,
          isConceptShift: concept !== lastConcept,
          isEmotionShift: emotion !== lastEmotion,
          word: sentence.text.split(" ").slice(0, 3).join(" "),
          text: sentence.text,
        });

        currentTime += estDuration;
        lastConcept = concept;
        lastEmotion = emotion;
      }
    }

    return moments;
  }

  buildBlocks(moments: SemanticMoment[]): TimelineBlock[] {
    const blocks: TimelineBlock[] = [];
    const totalDuration = this.clock.getDuration();

    for (let i = 0; i < moments.length; i++) {
      const moment = moments[i];
      const nextMoment = moments[i + 1];
      const endTime = nextMoment ? nextMoment.time : totalDuration;

      blocks.push({
        id: `block_${i}_${moment.scene}`,
        start: moment.time,
        end: endTime,
        scene: moment.scene,
        concept: moment.concept,
        imageId: "",
        imageType: moment.isConceptShift ? "master_scene" : "supporting_scene",
        motion: moment.isEmotionShift ? "slow_push_in" : "hold",
        motionIntensity: moment.importance > 8 ? "medium" : "low",
        transition: moment.isConceptShift ? "cross_fade" : "cut",
        transitionVisibility: moment.isConceptShift ? "visible" : "invisible",
        priority: this.calculatePriority(moment),
        subtitle: moment.text,
        emotion: moment.emotion as any,
        effects: [],
      });
    }

    return blocks;
  }

  buildMarkers(moments: SemanticMoment[]): TimelineMarker[] {
    const markers: TimelineMarker[] = [];

    for (let i = 0; i < moments.length; i++) {
      const moment = moments[i];
      const prev = i > 0 ? moments[i - 1] : null;

      markers.push({ time: moment.time, type: "scene_start", label: `Scene ${moment.scene}` });

      if (prev && moment.isConceptShift) {
        markers.push({
          time: moment.time,
          type: "concept_shift",
          label: `Concept: ${prev.concept} → ${moment.concept}`,
        });
      }

      if (prev && moment.isEmotionShift) {
        markers.push({
          time: moment.time,
          type: "emotion_change",
          label: `Emotion: ${prev.emotion} → ${moment.emotion}`,
        });
      }

      if (moment.importance >= 8) {
        markers.push({
          time: moment.time + 0.5,
          type: "word_highlight",
          label: `High-importance: ${moment.concept}`,
        });
      }
    }

    return markers;
  }

  private calculatePriority(moment: SemanticMoment): TimelineBlockPriority {
    if (moment.isConceptShift && moment.importance >= 8) return "critical";
    if (moment.isEmotionShift || moment.importance >= 6) return "high";
    if (moment.importance >= 4) return "medium";
    return "low";
  }
}
