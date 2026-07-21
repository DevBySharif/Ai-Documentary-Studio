import type { ImageDecision, ImageMemoryEntry, ImageCostEstimate } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";
import { ReuseScoreCalculator } from "./reuse-score.js";
import { ImageOpportunityEngine } from "./opportunity-engine.js";
import { VisualDecisionTree } from "./decision-tree.js";

const MAX_REUSE_COUNT = 5;
const MAX_SCREEN_TIME = 30;
const IMAGE_DENSITY_INTERVAL = 4;

export class ImageDecisionEngine {
  private reuseScore: ReuseScoreCalculator;
  private opportunity: ImageOpportunityEngine;
  private decisionTree: VisualDecisionTree;
  private imageMemory: Map<string, ImageMemoryEntry> = new Map();

  constructor() {
    this.reuseScore = new ReuseScoreCalculator();
    this.opportunity = new ImageOpportunityEngine();
    this.decisionTree = new VisualDecisionTree();
  }

  decide(
    segment: SemanticSegment,
    previousSegment: SemanticSegment | null,
    availableSymbols: string[]
  ): ImageDecision {
    const candidates = this.findReusableImages(segment);
    const bestCandidate = candidates[0];
    const hasSymbol = availableSymbols.includes(segment.metaphorSymbol ?? "");
    const opportunity = this.opportunity.evaluate(segment, previousSegment);
    const treeResult = this.decisionTree.execute(segment, previousSegment, !!bestCandidate, hasSymbol);

    const strategy = opportunity.score >= 50 ? opportunity.recommendation : treeResult.finalStrategy;

    let confidence = 0;
    let reason = "";

    if (strategy === "reuse" && bestCandidate) {
      confidence = bestCandidate.reuseCount < MAX_REUSE_COUNT ? 0.92 : 0.6;
      reason = bestCandidate.reuseCount < MAX_REUSE_COUNT
        ? `Reusing ${bestCandidate.imageId} (concept match, ${Math.round(bestCandidate.totalScreenTime)}s screen time)`
        : `Image ${bestCandidate.imageId} overused (${bestCandidate.reuseCount} times)`;
    } else if (strategy === "motion_only") {
      confidence = 0.85;
      reason = "Concept unchanged — camera motion will refresh composition";
    } else if (strategy === "word_insert" && segment.importance >= 7) {
      confidence = 0.88;
      reason = `High-importance concept "${segment.concept.primary}" deserves word-level insert`;
    } else if (strategy === "symbol_insert" && segment.metaphorSymbol) {
      confidence = 0.9;
      reason = `Metaphor detected — using symbol "${segment.metaphorSymbol}"`;
    } else {
      confidence = 0.75;
      reason = `New concept "${segment.concept.primary}" requires new image`;
    }

    return {
      segment: segment.index,
      strategy,
      imageId: bestCandidate?.imageId,
      reuseCount: bestCandidate?.reuseCount,
      screenTime: bestCandidate?.totalScreenTime,
      motion: this.suggestMotion(segment, strategy),
      transition: this.suggestTransition(segment),
      confidence,
      reason,
      opportunityScore: opportunity.score,
    };
  }

  recordImageUsage(imageId: string, segment: SemanticSegment, duration: number): void {
    const existing = this.imageMemory.get(imageId);
    if (existing) {
      existing.reuseCount++;
      existing.totalScreenTime += duration;
      existing.lastUsedScene = segment.scene;
    } else {
      this.imageMemory.set(imageId, {
        imageId,
        concept: segment.concept.primary,
        emotion: segment.emotion,
        camera: "",
        composition: "",
        visualIntent: segment.visualIntent,
        reuseCount: 1,
        totalScreenTime: duration,
        lastUsedScene: segment.scene,
        environment: "",
        character: "",
      });
    }
  }

  getImageMemory(imageId: string): ImageMemoryEntry | undefined {
    return this.imageMemory.get(imageId);
  }

  private findReusableImages(segment: SemanticSegment): ImageMemoryEntry[] {
    const candidates: Array<{ entry: ImageMemoryEntry; score: number }> = [];

    for (const entry of this.imageMemory.values()) {
      if (entry.reuseCount >= MAX_REUSE_COUNT) continue;
      if (entry.totalScreenTime >= MAX_SCREEN_TIME) continue;

      const score = this.reuseScore.calculate(segment, entry);
      candidates.push({ entry, score: score.score });
    }

    return candidates
      .sort((a, b) => b.score - a.score)
      .filter((c) => c.score >= 0.5)
      .map((c) => c.entry);
  }

  private suggestMotion(segment: SemanticSegment, strategy: string): string {
    if (strategy === "motion_only") return "slow_push_in";
    if (segment.isQuestion) return "slow_push_in";
    if (segment.isReveal) return "push_in";
    if (segment.emotion === "reflection") return "slow_zoom_in";
    if (segment.emotion === "wonder") return "slow_zoom_in";
    if (segment.emotion === "urgency") return "push_in";
    return "hold";
  }

  private suggestTransition(segment: SemanticSegment): string {
    if (segment.isReveal) return "cross_fade";
    if (segment.isMetaphor) return "fade";
    if (segment.isQuestion) return "fade";
    if (segment.emotion === "reflection") return "fade";
    return "cut";
  }
}
