import type { GrammarTransition, VisualGrammar, GrammarRule } from "./types.js";
import type { ImageType } from "../prompt/types.js";

export interface GrammarResult {
  transition: GrammarTransition;
  allowed: boolean;
  reason: string;
}

const IMAGE_TYPE_TO_GRAMMAR: Record<ImageType, string> = {
  master_scene: "master_scene",
  supporting_scene: "supporting_scene",
  word_visual: "word_visual",
  symbolic_visual: "symbolic_visual",
  transition_visual: "transition_visual",
};

export class VisualGrammarEngine {
  private grammar: VisualGrammar;

  constructor(grammar: VisualGrammar) {
    this.grammar = grammar;
  }

  determineTransition(
    prevImageType: ImageType,
    nextImageType: ImageType,
    sceneChanged: boolean,
    conceptChanged: boolean
  ): GrammarResult {
    const from = IMAGE_TYPE_TO_GRAMMAR[prevImageType] || "master_scene";
    const to = IMAGE_TYPE_TO_GRAMMAR[nextImageType] || "master_scene";

    if (from === to && !sceneChanged && !conceptChanged) {
      return {
        transition: "continue",
        allowed: true,
        reason: "Same visual context, continuing",
      };
    }

    if (conceptChanged || sceneChanged) {
      return {
        transition: "new_scene",
        allowed: true,
        reason: conceptChanged ? "Concept change, new scene" : "Scene boundary, new scene",
      };
    }

    const rule = this.findRule(from, to);
    if (rule) {
      const preferred = rule.preferredTransition;
      return {
        transition: preferred,
        allowed: true,
        reason: `Grammar rule: ${from} → ${to} via ${preferred}`,
      };
    }

    if (this.grammar.enforceContinuity) {
      return {
        transition: this.grammar.defaultTransition,
        allowed: true,
        reason: `No specific rule, using default: ${this.grammar.defaultTransition}`,
      };
    }

    return {
      transition: "new_scene",
      allowed: true,
      reason: "No grammar constraint, allowing new scene",
    };
  }

  isAllowedTransition(from: ImageType, to: ImageType, transition: GrammarTransition): boolean {
    const fromStr = IMAGE_TYPE_TO_GRAMMAR[from] || "master_scene";
    const toStr = IMAGE_TYPE_TO_GRAMMAR[to] || "master_scene";
    const rule = this.findRule(fromStr, toStr);
    return rule?.allowedTransitions.includes(transition) ?? false;
  }

  getSequence(shots: Array<{ imageType: ImageType; concept: string; sceneIndex: number }>): GrammarTransition[] {
    const transitions: GrammarTransition[] = [];

    for (let i = 1; i < shots.length; i++) {
      const prev = shots[i - 1];
      const curr = shots[i];
      const result = this.determineTransition(
        prev.imageType,
        curr.imageType,
        prev.sceneIndex !== curr.sceneIndex,
        prev.concept !== curr.concept
      );
      transitions.push(result.transition);
    }

    return transitions;
  }

  private findRule(from: string, to: string): GrammarRule | undefined {
    return this.grammar.rules.find((r) => r.from === from && r.to === to);
  }
}
