import type {
  PromptPlan, ScenePrompt, ScenePromptOutput, WordPrompt,
  ImageType, CameraAngle, MotionSuggestion, ReuseAction,
} from "./types.js";
import type { StoryScript, SemanticSegment, TaggedSentence } from "../story/types.js";
import type { NarrativeBlueprint, ScenePurpose } from "../narrative/types.js";
import type { ChannelDNA } from "../dna/types.js";
import type { ProjectDNA } from "../project/types.js";

import { ImageClassifier } from "./classifier.js";
import { WordPromptsEngine } from "./words.js";
import { ImageReuseEngine } from "./reuse.js";
import { ConceptShiftDetector } from "./concept-shift.js";
import { ConsistencyManager } from "./consistency.js";
import { GoogleFlowOptimizer } from "./optimizer.js";
import { PromptValidator } from "./validator.js";
import { ImagePlanBuilder, ZennVisualRhythm } from "./image-plan.js";
import { StoryboardEngine } from "./storyboard.js";

export interface PIEInput {
  script: StoryScript;
  blueprint: NarrativeBlueprint;
  channelDNA: ChannelDNA;
  projectDNA: ProjectDNA;
}

export class PromptIntelligenceEngine {
  private classifier: ImageClassifier;
  private wordEngine: WordPromptsEngine;
  private reuseEngine: ImageReuseEngine;
  private shiftDetector: ConceptShiftDetector;
  private consistency: ConsistencyManager;
  private optimizer: GoogleFlowOptimizer;
  public validator: PromptValidator;
  private imagePlanBuilder: ImagePlanBuilder;
  private zenn: ZennVisualRhythm;
  private storyboardEngine: StoryboardEngine;

  constructor() {
    this.classifier = new ImageClassifier();
    this.wordEngine = new WordPromptsEngine();
    this.reuseEngine = new ImageReuseEngine();
    this.shiftDetector = new ConceptShiftDetector();
    this.consistency = new ConsistencyManager();
    this.optimizer = new GoogleFlowOptimizer();
    this.validator = new PromptValidator();
    this.imagePlanBuilder = new ImagePlanBuilder();
    this.zenn = new ZennVisualRhythm();
    this.storyboardEngine = new StoryboardEngine();
  }

  generate(input: PIEInput): PromptPlan {
    const { script, blueprint, channelDNA, projectDNA } = input;

    const characterLock = this.consistency.buildCharacterLock(channelDNA);
    const artStyleLock = this.consistency.buildArtStyleLock(channelDNA, projectDNA);

    // 1. Build storyboard first
    const storyboard = this.storyboardEngine.generate(
      script.semanticSegments,
      script.metadata.id,
      script.metadata.projectId
    );

    // 2. Generate scene prompts from storyboard
    let scenePrompts = this.generateScenePrompts(
      storyboard.shots.map((s) => ({
        sceneIndex: s.sceneIndex,
        shot: s,
        segment: script.semanticSegments.find(
          (seg) => seg.sceneIndex === s.sceneIndex
        ),
      })),
      blueprint,
      channelDNA,
      projectDNA,
      characterLock,
      artStyleLock
    );

    // 3. Generate word prompts from sentences
    const wordPrompts = this.generateWordPrompts(script);

    // 4. Apply Zenn-style visual rhythm
    scenePrompts = this.zenn.apply(scenePrompts);

    // 5. Build image plan
    const imagePlan = this.imagePlanBuilder.build(scenePrompts);

    // 6. Format output
    const scenePromptOutputs = scenePrompts.map((sp) => this.formatOutput(sp));

    const totalNewImages = scenePrompts.filter((p) => !p.reuse).length;
    const totalReuses = scenePrompts.filter((p) => p.reuse).length;

    const validation = this.validator.validate(scenePrompts, artStyleLock, characterLock);

    return {
      scenePrompts: scenePromptOutputs,
      wordPrompts,
      imagePlan,
      storyboard,
      metadata: {
        id: `prompt_plan_${Date.now()}`,
        scriptId: script.metadata.id,
        projectId: script.metadata.projectId,
        version: "1.0",
        createdAt: new Date().toISOString(),
        validated: validation.passed,
        validationScore: validation.score.overallScore,
        totalPrompts: scenePromptOutputs.length + wordPrompts.length,
        totalNewImages,
        totalReuses,
      },
    };
  }

  private generateScenePrompts(
    shots: Array<{ sceneIndex: number; shot: any; segment?: SemanticSegment }>,
    _blueprint: NarrativeBlueprint,
    channelDNA: ChannelDNA,
    projectDNA: ProjectDNA,
    characterLock: any,
    artStyleLock: any
  ): ScenePrompt[] {
    const prompts: ScenePrompt[] = [];

    for (const { sceneIndex, shot, segment } of shots) {
      const prev = prompts[prompts.length - 1];
      const concepts = segment?.sentences.flatMap((s: TaggedSentence) =>
        s.concepts.map((c) => c.term)
      ) || [];
      const primaryConcept = concepts[0] || shot.concept;

      let shiftDetected = true;
      let reuseAction: ReuseAction = "new";

      if (prev) {
        const shift = this.shiftDetector.detect(
          prev.emotion || "calm",
          shot.emotion || "calm",
          [],
          [],
          prev.imageType as any,
          this.classifier.classifyByVisualIntent(segment?.visualIntent || "new_scene") as any,
          (blueprintScenePurpose(sceneIndex, _blueprint)) || "context",
          (blueprintScenePurpose(sceneIndex, _blueprint)) || "context"
        );
        shiftDetected = shift.shifted;
      }

      const reuseDecision = this.reuseEngine.determineAction(
        sceneIndex,
        shiftDetected,
        prev?.emotion !== shot.emotion,
        false
      );
      reuseAction = reuseDecision.action;

      if (!shiftDetected && prev) {
        shot.reuse = true;
        shot.reuseSourceShot = prev.sceneIndex;
        shot.reuseAction = reuseAction;
      }

      const imageType = shot.imageType || "master_scene";
      const environment = `${primaryConcept} scene`;
      const subject = primaryConcept;
      const action = `${shot.purpose} visualization`;

      let rawPrompt = this.optimizer.buildPrompt(subject, environment, action, artStyleLock, characterLock);
      rawPrompt = this.optimizer.addCameraMotion(rawPrompt, shot.cameraAngle, this.reuseEngine.suggestMotion(shot.reuseAction || "new"));
      rawPrompt = this.optimizer.optimizePrompt(rawPrompt);

      const negativePrompt = this.optimizer.buildNegativePrompt(imageType, artStyleLock.artStyle);
      const motion = this.reuseEngine.suggestMotion(shot.reuseAction || "new");

      const scenePrompt: ScenePrompt = {
        sceneIndex,
        imageType,
        prompt: rawPrompt,
        negativePrompt,
        reuse: shot.reuse,
        reuseSourceScene: shot.reuseSourceShot,
        reuseAction,
        camera: shot.cameraAngle,
        motion,
        lighting: artStyleLock.lighting,
        characterLock,
        artStyleLock,
        estimatedDuration: shot.estimatedDuration,
        concepts,
        emotion: shot.emotion,
      };

      prompts.push(scenePrompt);
    }

    return prompts;
  }

  private generateWordPrompts(script: StoryScript): WordPrompt[] {
    const wordPrompts: WordPrompt[] = [];

    for (const scene of script.scenes) {
      for (const sentence of scene.narration) {
        for (const concept of sentence.concepts) {
          const wp = this.wordEngine.generate(
            concept.term,
            scene.sceneNumber,
            sentence.index
          );
          if (wp) wordPrompts.push(wp);
        }
      }
    }

    return wordPrompts;
  }

  private formatOutput(sp: ScenePrompt): ScenePromptOutput {
    return {
      scene: sp.sceneIndex,
      image_type: sp.imageType,
      prompt: sp.prompt,
      negative_prompt: sp.negativePrompt,
      reuse: sp.reuse,
      camera: sp.camera,
      motion: sp.motion,
      estimated_duration: sp.estimatedDuration,
    };
  }
}

function blueprintScenePurpose(sceneIndex: number, blueprint: NarrativeBlueprint): string {
  const obj = blueprint.sceneObjectives.find((o) => o.sceneId === sceneIndex);
  return obj?.purpose || "context";
}
