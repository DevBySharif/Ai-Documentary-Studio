import type { RhythmBlock, VisualTempo, RhythmSignature, RhythmValidation } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";
import { AttentionCurveGenerator } from "./attention-curve.js";
import { CognitiveLoadEngine } from "./cognitive-load.js";
import { VisualFatigueDetector } from "./fatigue-detector.js";
import { HoldRhythmEngine } from "./hold-engine.js";
import { VisualBreathingEngine } from "./visual-breathing.js";
import { ViewerAttentionAI } from "./viewer-attention-ai.js";
import { CognitivePacingEngine } from "./cognitive-pacing.js";
import { RhythmSignatureSystem } from "./rhythm-signature.js";
import { RhythmValidator } from "./validator.js";

export class VisualRhythmEngine {
  private attention: AttentionCurveGenerator;
  private cognitive: CognitiveLoadEngine;
  private fatigue: VisualFatigueDetector;
  private hold: HoldRhythmEngine;
  private breathing: VisualBreathingEngine;
  private viewerAI: ViewerAttentionAI;
  private pacing: CognitivePacingEngine;
  private signature: RhythmSignatureSystem;
  private validator: RhythmValidator;

  constructor() {
    this.attention = new AttentionCurveGenerator();
    this.cognitive = new CognitiveLoadEngine();
    this.fatigue = new VisualFatigueDetector();
    this.hold = new HoldRhythmEngine();
    this.breathing = new VisualBreathingEngine();
    this.viewerAI = new ViewerAttentionAI();
    this.pacing = new CognitivePacingEngine();
    this.signature = new RhythmSignatureSystem();
    this.validator = new RhythmValidator();
  }

  process(
    segments: SemanticSegment[],
    narrationWPM: number,
    signatureName: RhythmSignature = "documentary"
  ): { blocks: RhythmBlock[]; validation: RhythmValidation } {
    const profile = this.signature.getProfile(signatureName);
    const attentionCurve = this.attention.generate(segments);
    const blocks: RhythmBlock[] = [];

    for (const seg of segments) {
      const cognitiveLoad = this.cognitive.estimate(seg, narrationWPM);
      const baseDuration = seg.end - seg.start;
      const holdRec = this.hold.recommend(seg, cognitiveLoad, baseDuration);

      const attentionPoint = attentionCurve.find((a) => Math.abs(a.time - seg.start) < 0.5) ?? attentionCurve[0];
      const viewerAttention = this.viewerAI.predict(seg.start, attentionCurve, seg.importance);
      const pacingResult = this.pacing.estimate(seg);

      const adjustedDuration = pacingResult.shouldExtendHold
        ? holdRec.recommendedDuration + pacingResult.recommendedHoldExtension
        : holdRec.recommendedDuration;

      const tempo = this.determineTempo(seg, profile.baseTempo, cognitiveLoad.load);
      const motionDensity = pacingResult.shouldReduceMotion
        ? profile.motionDensity * 0.6
        : profile.motionDensity;

      blocks.push({
        segment: seg.index,
        tempo,
        holdDuration: adjustedDuration,
        motionDensity,
        attentionScore: attentionPoint?.score ?? 50,
        informationDensity: seg.importance >= 8 ? "high" : seg.importance >= 5 ? "medium" : "low",
        cognitiveLoad: cognitiveLoad.load,
        energyLevel: this.calculateEnergy(seg),
      });
    }

    const breathingMoments = this.breathing.generate(segments);
    const totalDuration = segments.length > 0 ? segments[segments.length - 1].end : 0;
    const fatigueReport = this.fatigue.detect(
      blocks.length, blocks.filter((b) => b.motionDensity > 0.5).length,
      0, segments.filter((s) => s.isReveal).length, totalDuration
    );

    if (fatigueReport.fatigueLevel >= 60) {
      for (const block of blocks) {
        block.motionDensity *= 0.7;
        block.tempo = "slow";
      }
    }

    const validation = this.validator.validate(blocks, totalDuration);

    return { blocks, validation };
  }

  private determineTempo(seg: SemanticSegment, baseTempo: VisualTempo, cognitiveLoad: number): VisualTempo {
    if (cognitiveLoad >= 70) return "slow";
    if (seg.isReveal || seg.isQuestion) return "medium";
    if (seg.emotion === "urgency") return "fast";
    if (seg.emotion === "reflection") return "slow";
    return baseTempo;
  }

  private calculateEnergy(seg: SemanticSegment): number {
    const energyMap: Record<string, number> = {
      urgency: 80, surprise: 75, awe: 70, suspense: 65, curiosity: 55,
      hope: 50, wonder: 45, mystery: 40, calm: 20, reflection: 15,
    };
    return energyMap[seg.emotion] ?? 40;
  }
}
