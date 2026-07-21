export type FeatureFamilyName =
  | "AiResearchEngine"
  | "AiScriptWriter"
  | "AiDocumentaryPlanner"
  | "AiStoryboardGenerator"
  | "AiVisualAssetPlanner"
  | "AiPromptGenerator"
  | "AiVoiceDirector"
  | "AiTimelineComposer"
  | "AiSceneOptimizer"
  | "AiProductionAssistant"
  | "AiReviewer"
  | "AiQualityScoring"
  | "AiFactChecker"
  | "AiCopyrightAssistant"
  | "AiPublishingAssistant";

export interface FeatureFamilyDescriptor {
  readonly name: FeatureFamilyName;
  readonly title: string;
  readonly description: string;
}

/**
 * 15 Feature Families Registry (Vol 04 Part 01 - Section 11).
 * Independent but interoperable AI feature systems.
 */
export class FeatureFamilyRegistry {
  private families = new Map<FeatureFamilyName, FeatureFamilyDescriptor>();

  constructor() {
    this.initFamilies();
  }

  private initFamilies(): void {
    const list: FeatureFamilyDescriptor[] = [
      { name: "AiResearchEngine", title: "AI Research Engine", description: "Fact gathering, source comparison, and historical analysis" },
      { name: "AiScriptWriter", title: "AI Script Writer", description: "Documentary scripts, narration, hooks, and scene descriptions" },
      { name: "AiDocumentaryPlanner", title: "AI Documentary Planner", description: "Production goal planning and timeline structuring" },
      { name: "AiStoryboardGenerator", title: "AI Storyboard Generator", description: "Visual shot planning and storyboard prompts" },
      { name: "AiVisualAssetPlanner", title: "AI Visual Asset Planner", description: "B-roll planning and visual prompt organization" },
      { name: "AiPromptGenerator", title: "AI Prompt Generator", description: "Optimized prompts for image/video generation" },
      { name: "AiVoiceDirector", title: "AI Voice Director", description: "Narration style, voice selection, and speech pacing" },
      { name: "AiTimelineComposer", title: "AI Timeline Composer", description: "NLE clip placement and multi-track composition" },
      { name: "AiSceneOptimizer", title: "AI Scene Optimizer", description: "Scene-level pacing, color balance, and visual rhythm" },
      { name: "AiProductionAssistant", title: "AI Production Assistant", description: "Real-time editing guidance and recommendations" },
      { name: "AiReviewer", title: "AI Reviewer", description: "Comprehensive production review and feedback" },
      { name: "AiQualityScoring", title: "AI Quality Scoring", description: "Technical and narrative quality scoring" },
      { name: "AiFactChecker", title: "AI Fact Checker", description: "Fact verification and citation matching" },
      { name: "AiCopyrightAssistant", title: "AI Copyright Assistant", description: "Copyright awareness and license validation" },
      { name: "AiPublishingAssistant", title: "AI Publishing Assistant", description: "Export preset selection and channel publishing" },
    ];

    list.forEach((f) => this.families.set(f.name, f));
  }

  public getFamily(name: FeatureFamilyName): FeatureFamilyDescriptor | undefined {
    return this.families.get(name);
  }

  public listAll(): ReadonlyArray<FeatureFamilyDescriptor> {
    return Array.from(this.families.values());
  }
}
