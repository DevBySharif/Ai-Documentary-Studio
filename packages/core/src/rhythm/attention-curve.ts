import type { AttentionCurvePoint } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";

export class AttentionCurveGenerator {
  generate(segments: SemanticSegment[]): AttentionCurvePoint[] {
    const curve: AttentionCurvePoint[] = [];
    let currentScore = 50;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const phase = this.determinePhase(seg, i, segments.length);
      const delta = this.getAttentionDelta(seg, phase);

      currentScore = Math.max(0, Math.min(100, currentScore + delta));

      curve.push({ time: seg.start, score: currentScore, phase });
    }

    return curve;
  }

  private determinePhase(seg: SemanticSegment, index: number, total: number): string {
    if (index === 0 && seg.type === "introduction") return "hook";
    if (seg.isReveal) return "reveal";
    if (seg.isQuestion) return "curiosity_build";
    if (seg.isMetaphor) return "reflection";
    if (index === total - 1) return "ending";
    if (seg.emotion === "reflection" || seg.emotion === "calm") return "explanation";
    return "engagement";
  }

  private getAttentionDelta(seg: SemanticSegment, phase: string): number {
    const deltas: Record<string, number> = {
      hook: 20, curiosity_build: 10, reveal: 25, reflection: -10,
      explanation: -5, engagement: 5, ending: 15,
    };
    const base = deltas[phase] ?? 0;
    return base + (seg.importance >= 7 ? 5 : 0);
  }
}
