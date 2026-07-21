import type { ReuseContext, ReuseDecision } from "./types.js";

export class ContextAwareReuseEngine {
  evaluate(context: ReuseContext): ReuseDecision {
    let score = 50;
    const reasons: string[] = [];

    if (context.shownRecently && context.timeSinceLastShow !== null && context.timeSinceLastShow < 10) {
      score -= 25;
      reasons.push("Shown too recently (under 10s ago) — may cause fatigue");
    }

    if (context.shownRecently === false || (context.timeSinceLastShow !== null && context.timeSinceLastShow >= 30)) {
      score += 15;
      reasons.push("Long enough since last appearance — safe to reuse");
    }

    if (context.wouldImproveContinuity) {
      score += 20;
      reasons.push("Reuse would improve visual continuity");
    }

    if (context.wouldCauseFatigue) {
      score -= 30;
      reasons.push("Reuse may cause viewer fatigue");
    }

    if (context.hasCameraMotion) {
      score += 10;
      reasons.push("Camera motion creates enough novelty");
    }

    if (context.isSymbolicInsert) {
      score += 15;
      reasons.push("Symbolic insert is more effective than full image reuse");
    }

    const shouldReuse = score >= 60;
    const confidence = Math.min(100, Math.max(0, score));

    return {
      shouldReuse,
      confidence,
      reason: reasons.join("; ") || "No strong contextual signals",
      suggestedMotion: shouldReuse && context.hasCameraMotion ? "gentle_push_in" : undefined,
      suggestedDuration: shouldReuse ? 4 : undefined,
    };
  }
}
