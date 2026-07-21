import type { SemanticSegment, TaggedSentence, VisualIntent } from "./types.js";
import type { ScriptScene } from "./types.js";

const conceptOverlap = (a: string[], b: string[]): boolean => {
  const aSet = new Set(a.map((c) => c.toLowerCase()));
  return b.some((c) => aSet.has(c.toLowerCase()));
};

const intentGroupKey = (intent: VisualIntent): string => {
  if (intent === "new_scene" || intent === "wide_shot") return "scene";
  if (intent === "diagram") return "diagram";
  if (intent === "close_up") return "detail";
  if (intent === "word_level_insert") return "word";
  if (intent === "motion_graphics") return "motion";
  return "visual";
};

const MOTION_SUGGESTIONS: Record<string, string> = {
  scene: "gentle_pan",
  diagram: "static",
  detail: "slow_zoom",
  word: "none",
  motion: "animated",
  visual: "slow_pan",
};

const TRANSITION_SUGGESTIONS: Record<string, string> = {
  scene: "cut",
  diagram: "dissolve",
  detail: "dissolve",
  word: "quick_cut",
  motion: "fade",
  visual: "crossfade",
};

export class SemanticSegmentationEngine {
  segment(scenes: ScriptScene[]): SemanticSegment[] {
    const segments: SemanticSegment[] = [];
    let segmentCounter = 0;

    for (const scene of scenes) {
      const sentences = scene.narration;
      if (sentences.length === 0) continue;

      let currentStart = 0;

      for (let i = 1; i <= sentences.length; i++) {
        const shouldSplit = i < sentences.length && this.shouldSplit(
          sentences[i - 1], sentences[i]
        );

        if (shouldSplit || i === sentences.length) {
          const group = sentences.slice(currentStart, i);
          const primaryIntent = this.dominantIntent(group);
          const groupKey = intentGroupKey(primaryIntent);
          const primaryConcept = this.dominantConcept(group);

          segments.push({
            id: `seg_${scene.sceneNumber}_${segmentCounter++}`,
            sceneIndex: scene.sceneNumber,
            startSentenceIndex: currentStart,
            endSentenceIndex: i - 1,
            visualConcept: primaryConcept || scene.keyConcept,
            visualIntent: primaryIntent,
            imageAction: this.imageActionForIntent(primaryIntent),
            motionSuggestion: MOTION_SUGGESTIONS[groupKey] || "gentle_pan",
            transitionSuggestion: TRANSITION_SUGGESTIONS[groupKey] || "cut",
            sentences: group,
            totalDuration: group.reduce((s, g) => s + g.estimatedDuration, 0),
          });

          currentStart = i;
        }
      }
    }

    return segments;
  }

  private shouldSplit(prev: TaggedSentence, next: TaggedSentence): boolean {
    const prevConcepts = prev.concepts.map((c) => c.term);
    const nextConcepts = next.concepts.map((c) => c.term);

    if (prev.visualIntent !== next.visualIntent) return true;

    if (prevConcepts.length > 0 && nextConcepts.length > 0) {
      return !conceptOverlap(prevConcepts, nextConcepts);
    }

    return false;
  }

  private dominantIntent(sentences: TaggedSentence[]): VisualIntent {
    const counts = new Map<VisualIntent, number>();
    for (const s of sentences) {
      counts.set(s.visualIntent, (counts.get(s.visualIntent) || 0) + 1);
    }
    let max = 0;
    let dominant: VisualIntent = "symbolic_visual";
    for (const [intent, count] of counts) {
      if (count > max) {
        max = count;
        dominant = intent;
      }
    }
    return dominant;
  }

  private dominantConcept(sentences: TaggedSentence[]): string | null {
    const counts = new Map<string, number>();
    for (const s of sentences) {
      for (const c of s.concepts) {
        counts.set(c.term, (counts.get(c.term) || 0) + (c.importance || 1));
      }
    }
    let max = 0;
    let dominant: string | null = null;
    for (const [term, count] of counts) {
      if (count > max) {
        max = count;
        dominant = term;
      }
    }
    return dominant;
  }

  private imageActionForIntent(intent: VisualIntent): string {
    if (intent === "new_scene" || intent === "wide_shot") return "new_image";
    if (intent === "image_reuse") return "reuse";
    if (intent === "close_up") return "zoom_in";
    if (intent === "symbolic_visual") return "symbolic_insert";
    if (intent === "word_level_insert") return "word_visual";
    if (intent === "motion_graphics") return "new_image";
    return "new_image";
  }
}
