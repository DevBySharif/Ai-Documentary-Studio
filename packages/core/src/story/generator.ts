import type { StoryScript, ScriptScene, TaggedSentence, HookOutput } from "./types.js";
import type { NarrativeBlueprint, SceneObjective } from "../narrative/types.js";
import type { ChannelDNA } from "../dna/types.js";
import type { ProjectDNA } from "../project/types.js";
import { HookEngine } from "./hooks.js";
import { TransitionEngine } from "./transitions.js";
import { SentenceEngine } from "./sentences.js";
import { FactHandler } from "./facts.js";
import { TimingEstimator } from "./timing.js";
import { SemanticSegmentationEngine } from "./semantic.js";
import { ScriptValidator } from "./validator.js";

export interface StoryGeneratorInput {
  blueprint: NarrativeBlueprint;
  channelDNA: ChannelDNA;
  projectDNA: ProjectDNA;
}

export class StoryGenerator {
  private hookEngine: HookEngine;
  private transitionEngine: TransitionEngine;
  private sentenceEngine: SentenceEngine;
  private factHandler: FactHandler;
  private timingEstimator: TimingEstimator;
  private semanticEngine: SemanticSegmentationEngine;
  public validator: ScriptValidator;

  constructor() {
    this.hookEngine = new HookEngine();
    this.transitionEngine = new TransitionEngine();
    this.sentenceEngine = new SentenceEngine();
    this.factHandler = new FactHandler();
    this.timingEstimator = new TimingEstimator();
    this.semanticEngine = new SemanticSegmentationEngine();
    this.validator = new ScriptValidator();
  }

  generate(input: StoryGeneratorInput): StoryScript {
    const { blueprint, channelDNA, projectDNA } = input;

    const hook = this.hookEngine.generate(blueprint, channelDNA, projectDNA);
    const scenes = this.buildScenes(blueprint, projectDNA);
    const timedScenes = scenes.map((s) => this.timingEstimator.estimateScene(s));
    const allSentences = timedScenes.flatMap((s) => s.narration);
    const totalDuration = allSentences.reduce((t, s) => t + s.estimatedDuration, 0);
    const totalWordCount = allSentences.reduce((t, s) => t + s.wordCount, 0);
    const semanticSegments = this.semanticEngine.segment(timedScenes);

    const script: StoryScript = {
      scenes: timedScenes,
      hook,
      totalDuration: Math.round(totalDuration * 10) / 10,
      totalWordCount,
      semanticSegments,
      metadata: {
        id: `script_${Date.now()}`,
        blueprintId: blueprint.metadata.id,
        projectId: blueprint.metadata.projectId,
        version: "1.0",
        createdAt: new Date().toISOString(),
        validated: false,
        validationScore: 0,
        totalScenes: timedScenes.length,
        runtime: Math.round(totalDuration * 10) / 10,
      },
    };

    const report = this.validator.validate(script, blueprint.runtime, blueprint.sceneCount);
    script.metadata.validated = report.passed;
    script.metadata.validationScore = report.score;

    return script;
  }

  private buildScenes(
    blueprint: NarrativeBlueprint,
    projectDNA: ProjectDNA
  ): ScriptScene[] {
    const scenes: ScriptScene[] = [];
    const conceptPool = new Set<string>();

    for (const objective of blueprint.sceneObjectives) {
      const sceneDNA = projectDNA.cameraLanguage[
        objective.purpose as keyof typeof projectDNA.cameraLanguage
      ] || projectDNA.cameraLanguage.default;

      const sentences = this.sentenceEngine.generateSentences(
        objective,
        blueprint.wordEmphasisList.map((w) => w.word),
        conceptPool
      );

      const timedSentences = this.timingEstimator.estimateSentences(sentences);

      scenes.push({
        sceneNumber: objective.sceneId,
        purpose: objective.purpose,
        narration: timedSentences,
        emotion: (objective.emotion as any) || "calm",
        keyConcept: objective.knowledge,
        visualIntent: this.visualIntentForPurpose(objective.purpose),
        estimatedDuration: timedSentences.reduce((t, s) => t + s.estimatedDuration, 0),
        importance: objective.importance,
        sceneTransition: this.transitionEngine.selectForPurpose(objective.purpose),
      });
    }

    return scenes;
  }

  private visualIntentForPurpose(purpose: string): import("./types.js").VisualIntent {
    const map: Record<string, import("./types.js").VisualIntent> = {
      hook: "new_scene",
      context: "symbolic_visual",
      explain: "diagram",
      reveal: "symbolic_visual",
      evidence: "close_up",
      summarize: "wide_shot",
      cta: "wide_shot",
      transition: "motion_graphics",
    };
    return map[purpose] || "symbolic_visual";
  }
}
