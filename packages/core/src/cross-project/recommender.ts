import type { SmartRecommendation } from "./types.js";
import { CrossProjectMemory } from "./memory.js";
import { StoryPatternLibrary } from "./story-patterns.js";
import { SymbolMemory } from "./symbol-memory.js";
import { CrossProjectMotionMemory as MotionMemory } from "./motion-memory.js";
import { CrossProjectTimelineMemory as TimelineMemory } from "./timeline-memory.js";

export class SmartRecommender {
  constructor(
    private memory: CrossProjectMemory,
    private storyPatterns: StoryPatternLibrary,
    private symbols: SymbolMemory,
    private motionMem: MotionMemory,
    private timelineMem: TimelineMemory
  ) {}

  recommendFor(concept: string, projectTheme: string): SmartRecommendation {
    const lower = concept.toLowerCase();
    const recommendedAssets = this.memory.getBestImages(5);
    const recommendedPrompts = this.memory.getBestPrompts(5);
    const recommendedMotion = this.motionMem.findBestForStyle(projectTheme).map((m) => m.id);
    const recommendedTimelines = this.timelineMem.getTopTimelines(3).map((t) => t.id);
    const recommendedStories = this.storyPatterns.findBestFor(concept).map((s) => s.id);
    const recommendedSymbols = this.symbols.findByConcept(lower).map((s) => s.symbol);
    const similarProjects: string[] = [];

    const conceptScore = (recommendedAssets.length + recommendedPrompts.length) / 10;
    const score = Math.min(conceptScore, 1);

    return {
      recommendedAssets,
      recommendedPrompts,
      recommendedMotion,
      recommendedTimelines,
      recommendedStories,
      recommendedSymbols,
      similarProjects,
      reuseScore: score
    };
  }
}
