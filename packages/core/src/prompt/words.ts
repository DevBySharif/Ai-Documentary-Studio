import type { WordPrompt, CameraAngle, MotionSuggestion } from "./types.js";

const HIGH_IMPACT_CONCEPTS = new Set([
  "memory", "identity", "brain", "fear", "habit", "dopamine",
  "silence", "dream", "freedom", "consciousness", "mind", "thought",
  "emotion", "time", "death", "love", "pain", "pleasure",
  "perception", "reality", "illusion", "truth", "belief",
  "prediction", "future", "past", "change", "growth",
  "energy", "light", "darkness", "sound", "vision",
  "algorithm", "pattern", "chaos", "order", "system",
]);

const SCIENTIFIC_TERMS = new Set([
  "neuron", "synapse", "cortex", "dopamine", "serotonin",
  "oxytocin", "cortisol", "amygdala", "hippocampus",
  "prefrontal", "cerebellum", "brainstem", "neural",
  "cognitive", "behavioral", "psychological", "biological",
]);

const WORD_VISUAL_TEMPLATES: Record<string, string> = {
  concept: "A glowing {word} floating in dark space, minimalist vector, ethereal atmosphere",
  emotion: "Abstract visualization of {word}, flowing organic shapes in warm tones",
  object: "Clean minimalist vector illustration of {word}, soft lighting, neutral background",
  action: "Dynamic representation of {word}, motion lines suggesting movement",
  symbol: "Symbolic representation of {word}, minimalist icon style, centered composition",
};

const WORD_CAMERA: Record<string, CameraAngle> = {
  concept: "close_up",
  emotion: "extreme_close_up",
  object: "medium_shot",
  action: "wide_shot",
  symbol: "close_up",
};

export class WordPromptsEngine {
  isHighImpact(word: string): boolean {
    const lower = word.toLowerCase();
    return HIGH_IMPACT_CONCEPTS.has(lower) || SCIENTIFIC_TERMS.has(lower);
  }

  detectCategory(word: string): string {
    const lower = word.toLowerCase();
    if (SCIENTIFIC_TERMS.has(lower)) return "concept";
    if (["fear", "love", "pain", "pleasure", "hope", "wonder", "curiosity"].includes(lower)) return "emotion";
    if (["habit", "dream", "silence", "memory", "identity", "freedom", "truth"].includes(lower)) return "symbol";
    if (["predict", "change", "grow", "learn", "think", "feel"].includes(lower)) return "action";
    return "concept";
  }

  generate(word: string, sceneIndex: number, sentenceIndex: number): WordPrompt | null {
    if (!this.isHighImpact(word)) return null;

    const category = this.detectCategory(word);
    const template = WORD_VISUAL_TEMPLATES[category] || WORD_VISUAL_TEMPLATES.concept;
    const prompt = template.replace(/{word}/g, word);
    const camera = WORD_CAMERA[category] || "close_up";

    return {
      word,
      category,
      sceneIndex,
      sentenceIndex,
      prompt,
      negativePrompt: "text, watermark, logo, photorealistic, 3d, blurry, extra elements",
      visualTemplate: template,
      camera,
      motion: "slow_push_in",
      estimatedDuration: 2.5,
    };
  }
}
