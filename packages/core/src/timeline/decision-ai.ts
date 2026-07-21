import type { TimelineBlock, TimelineDecision } from "./types.js";
import type { StoryScript } from "../story/types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";
import { TimelineClock } from "./clock.js";

export class TimelineDecisionAI {
  private clock: TimelineClock;

  constructor(clock: TimelineClock) {
    this.clock = clock;
  }

  decide(
    blocks: TimelineBlock[],
    script: StoryScript,
    audio: AudioIntelligenceResult
  ): TimelineDecision[] {
    const decisions: TimelineDecision[] = [];

    for (let i = 0; i < blocks.length; i++) {
      const current = blocks[i];
      const previous = i > 0 ? blocks[i - 1] : null;

      decisions.push(this.shouldContinueImage(current, previous, script, i));
      decisions.push(this.shouldCameraMoveInstead(current, previous, i));
      decisions.push(this.isWorthyOfWordInsert(current, script, i));
      decisions.push(this.hasMeaningChanged(current, previous, script, i));
      decisions.push(this.determineTransitionVisibility(current, previous, i));
      decisions.push(this.determineHoldDuration(current, audio, i));
    }

    return decisions;
  }

  private shouldContinueImage(
    current: TimelineBlock,
    previous: TimelineBlock | null,
    script: StoryScript,
    index: number
  ): TimelineDecision {
    if (!previous) {
      return {
        moment: current.start,
        scene: current.scene,
        question: "Should the current image continue?",
        answer: "No — first block, needs new image",
        confidence: 1.0,
        reason: "No previous image exists",
      };
    }

    const scene = script.scenes.find((s) => s.sceneNumber === current.scene);
    if (!scene) {
      return {
        moment: current.start,
        scene: current.scene,
        question: "Should the current image continue?",
        answer: "Yes — continue previous image",
        confidence: 0.6,
        reason: "Unknown scene",
      };
    }

    const sameConcept = current.concept === previous.concept;
    const sameEmotion = current.emotion === previous.emotion;
    const lowImportance = scene.importance < 4;
    const recentChange = current.start - previous.start < 3;

    if (sameConcept && sameEmotion && (lowImportance || recentChange)) {
      return {
        moment: current.start,
        scene: current.scene,
        question: "Should the current image continue?",
        answer: "Yes — continue previous image",
        confidence: 0.85,
        reason: "Same concept+emotion, low importance or quick succession",
      };
    }

    return {
      moment: current.start,
      scene: current.scene,
      question: "Should the current image continue?",
      answer: "No — new image needed",
      confidence: 0.9,
      reason: "Meaning changed sufficiently",
    };
  }

  private shouldCameraMoveInstead(
    current: TimelineBlock,
    previous: TimelineBlock | null,
    index: number
  ): TimelineDecision {
    if (current.imageType === "supporting_scene" && previous) {
      return {
        moment: current.start,
        scene: current.scene,
        question: "Should the camera move instead of changing the image?",
        answer: "Yes — supporting scene, use camera motion instead",
        confidence: 0.8,
        reason: "Supporting scene type allows camera motion to refresh composition",
      };
    }

    return {
      moment: current.start,
      scene: current.scene,
      question: "Should the camera move instead of changing the image?",
      answer: "No — image change required",
      confidence: 0.7,
      reason: "Content change justifies new image",
    };
  }

  private isWorthyOfWordInsert(
    current: TimelineBlock,
    script: StoryScript,
    index: number
  ): TimelineDecision {
    const scene = script.scenes.find((s) => s.sceneNumber === current.scene);
    if (!scene) {
      return {
        moment: current.start,
        scene: current.scene,
        question: "Is this concept important enough for a word-level insert?",
        answer: "No",
        confidence: 0.5,
        reason: "Unknown scene",
      };
    }

    const isMajorConcept = scene.importance >= 7 || current.priority === "critical" || current.priority === "high";
    const isEmphasisWord = scene.narration.some((s) => s.emphasisWords.includes(current.concept));

    if (isMajorConcept || isEmphasisWord) {
      return {
        moment: current.start,
        scene: current.scene,
        question: "Is this concept important enough for a word-level insert?",
        answer: "Yes — add word-level visual insert",
        confidence: 0.9,
        reason: `High importance (${scene.importance}) or emphasis word`,
      };
    }

    return {
      moment: current.start,
      scene: current.scene,
      question: "Is this concept important enough for a word-level insert?",
      answer: "No — standard visual sufficient",
      confidence: 0.8,
      reason: "Standard importance level",
    };
  }

  private hasMeaningChanged(
    current: TimelineBlock,
    previous: TimelineBlock | null,
    script: StoryScript,
    index: number
  ): TimelineDecision {
    if (!previous) {
      return {
        moment: current.start,
        scene: current.scene,
        question: "Has the meaning changed enough to justify a new image?",
        answer: "Yes — first block",
        confidence: 1.0,
        reason: "No previous meaning to compare",
      };
    }

    const conceptChanged = current.concept !== previous.concept;
    const emotionChanged = current.emotion !== previous.emotion;
    const sceneChanged = current.scene !== previous.scene;

    if (conceptChanged || emotionChanged || sceneChanged) {
      return {
        moment: current.start,
        scene: current.scene,
        question: "Has the meaning changed enough to justify a new image?",
        answer: "Yes — meaning shift detected",
        confidence: 0.95,
        reason: [
          conceptChanged ? "concept changed" : "",
          emotionChanged ? "emotion changed" : "",
          sceneChanged ? "scene changed" : "",
        ].filter(Boolean).join(", "),
      };
    }

    return {
      moment: current.start,
      scene: current.scene,
      question: "Has the meaning changed enough to justify a new image?",
      answer: "No — same meaning, continue current image",
      confidence: 0.9,
      reason: "No concept, emotion, or scene change",
    };
  }

  private determineTransitionVisibility(
    current: TimelineBlock,
    previous: TimelineBlock | null,
    index: number
  ): TimelineDecision {
    if (!previous) {
      return {
        moment: current.start,
        scene: current.scene,
        question: "Should the transition be visible or invisible?",
        answer: "Invisible — no previous block",
        confidence: 1.0,
        reason: "First block",
      };
    }

    const sceneChanged = current.scene !== previous.scene;
    const conceptChanged = current.concept !== previous.concept;
    const emotionChanged = current.emotion !== previous.emotion;

    if (sceneChanged) {
      return {
        moment: current.start,
        scene: current.scene,
        question: "Should the transition be visible or invisible?",
        answer: "Visible — scene change",
        confidence: 1.0,
        reason: "New scene demands visible transition",
      };
    }

    if (conceptChanged && emotionChanged) {
      return {
        moment: current.start,
        scene: current.scene,
        question: "Should the transition be visible or invisible?",
        answer: "Visible — concept and emotion both changed",
        confidence: 0.85,
        reason: "Dual meaning change",
      };
    }

    if (conceptChanged || emotionChanged) {
      return {
        moment: current.start,
        scene: current.scene,
        question: "Should the transition be visible or invisible?",
        answer: "Subtle — single meaning change",
        confidence: 0.75,
        reason: "Minor meaning change",
      };
    }

    return {
      moment: current.start,
      scene: current.scene,
      question: "Should the transition be visible or invisible?",
      answer: "Invisible — same meaning",
      confidence: 0.9,
      reason: "No meaning change, no transition needed",
    };
  }

  private determineHoldDuration(
    current: TimelineBlock,
    audio: AudioIntelligenceResult,
    index: number
  ): TimelineDecision {
    const duration = current.end - current.start;
    let recommendedDuration: number;

    switch (current.priority) {
      case "critical":
        recommendedDuration = Math.max(duration, 6);
        break;
      case "high":
        recommendedDuration = Math.max(duration, 4);
        break;
      case "medium":
        recommendedDuration = Math.max(duration, 2.5);
        break;
      default:
        recommendedDuration = Math.max(duration, 1.5);
    }

    const match = duration >= recommendedDuration * 0.8;

    return {
      moment: current.start,
      scene: current.scene,
      question: "How long should the viewer stay on this visual before moving on?",
      answer: match
        ? `${duration.toFixed(1)}s — adequate hold duration`
        : `${recommendedDuration.toFixed(1)}s recommended (currently ${duration.toFixed(1)}s)`,
      confidence: match ? 0.9 : 0.7,
      reason: match
        ? `Priority "${current.priority}" requires ≥${recommendedDuration.toFixed(1)}s, got ${duration.toFixed(1)}s`
        : `Priority "${current.priority}" requires ≥${recommendedDuration.toFixed(1)}s, only ${duration.toFixed(1)}s`,
    };
  }
}
