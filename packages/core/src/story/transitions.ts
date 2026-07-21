import type { TransitionType } from "./types.js";
import type { ScenePurpose } from "../narrative/types.js";

const TRANSITION_MAP: Partial<Record<ScenePurpose, TransitionType>> = {
  hook: "cause_effect",
  context: "past_present",
  explain: "analogy_explanation",
  reveal: "observation_insight",
  evidence: "observation_insight",
  summarize: "cause_effect",
  cta: "problem_solution",
};

const TRANSITION_PHRASES: Record<TransitionType, string[]> = {
  cause_effect: [
    "And that's why",
    "This leads to",
    "Because of this",
    "The result is",
    "Which means",
  ],
  question_answer: [
    "The answer is simple",
    "Here's why",
    "To understand this",
    "The question is",
  ],
  past_present: [
    "But today",
    "Now, fast forward to",
    "Back then",
    "Today, we know",
  ],
  problem_solution: [
    "So how do we fix this",
    "The solution is",
    "Here's what works",
    "One approach is",
  ],
  observation_insight: [
    "Here's the key insight",
    "What we discovered is",
    "The truth is",
    "This reveals something",
  ],
  analogy_explanation: [
    "Think of it like",
    "It's similar to",
    "Imagine this",
    "Compare it to",
  ],
};

export class TransitionEngine {
  selectForPurpose(purpose: ScenePurpose): TransitionType {
    return TRANSITION_MAP[purpose] || "cause_effect";
  }

  getPhrase(transition: TransitionType): string {
    const phrases = TRANSITION_PHRASES[transition];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  chain(prevPurpose: string, nextPurpose: string): TransitionType {
    const pairs: Record<string, TransitionType> = {
      "hook_context": "cause_effect",
      "context_explain": "question_answer",
      "explain_evidence": "observation_insight",
      "reveal_summarize": "cause_effect",
      "summarize_cta": "problem_solution",
    };
    return pairs[`${prevPurpose}_${nextPurpose}`] || "cause_effect";
  }
}
