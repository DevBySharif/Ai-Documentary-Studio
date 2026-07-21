import type { HookPattern, HookOutput } from "./types.js";
import type { ChannelDNA } from "../dna/types.js";
import type { NarrativeBlueprint } from "../narrative/types.js";

const HOOK_TEMPLATES: Record<HookPattern, (topic: string, message: string) => string> = {
  unexpected_fact: (topic, _message) =>
    `Most people don't know this, but ${topic} is completely different from what we've been told.`,

  counter_intuitive: (topic, _message) =>
    `The more you learn about ${topic}, the less it makes sense.`,

  curiosity_question: (topic, _message) =>
    `What if everything you know about ${topic} is wrong?`,

  mystery: (topic, _message) =>
    `There's a strange truth hidden inside ${topic} — and most people never see it.`,

  strong_contrast: (topic, _message) =>
    `One group swears ${topic} is dangerous. Another says it's the future. Who's right?`,

  emotional_trigger: (topic, message) =>
    `This one idea about ${topic} could change how you see ${message || "the world"}.`,
};

function patternFromDNA(dna: ChannelDNA): HookPattern {
  const formula = dna.story.hookFormula?.toLowerCase() || "";
  if (formula.includes("mystery") || formula.includes("suspense")) return "mystery";
  if (formula.includes("unexpected") || formula.includes("fact")) return "unexpected_fact";
  if (formula.includes("question") || formula.includes("curiosity")) return "curiosity_question";
  if (formula.includes("contrast") || formula.includes("debate")) return "strong_contrast";
  if (formula.includes("emotional") || formula.includes("trigger")) return "emotional_trigger";
  if (formula.includes("myth") || formula.includes("challenge")) return "counter_intuitive";
  if (dna.story.questionStyle?.some((q) => q.includes("mystery"))) return "mystery";
  if (dna.story.questionStyle?.some((q) => q.includes("curiosity"))) return "curiosity_question";
  return "curiosity_question";
}

export class HookEngine {
  generate(
    blueprint: NarrativeBlueprint,
    channelDNA: ChannelDNA,
    projectDNA: { identity: { topic: string } }
  ): HookOutput {
    const pattern = patternFromDNA(channelDNA);
    const generator = HOOK_TEMPLATES[pattern];
    const text = generator(projectDNA.identity.topic, blueprint.coreMessage);
    const estimatedDuration = text.split(" ").length * 0.35;

    return { pattern, text, estimatedDuration };
  }
}
