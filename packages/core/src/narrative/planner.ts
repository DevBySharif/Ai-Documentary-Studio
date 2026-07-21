import type {
  NarrativeBlueprint, StoryArc, CuriosityLoop, EmotionPoint, KnowledgeStep,
  SceneObjective, RevealPlan, PacingProfile, VisualNarrativePlan, WordEmphasis,
  ViewerRetentionPlan, VisualSynchronizationPlan, VisualSyncSentence,
  DensityScore, ScenePurpose, StoryArcPhase, ImageAction,
} from "./types.js";
import type { ProjectDNA } from "../project/types.js";
import type { ChannelDNA } from "../dna/types.js";

export interface NarrativePlannerInput {
  projectDna: ProjectDNA;
  channelDna: ChannelDNA;
  research: { keyConcepts: string[]; sources: string[] };
  idea: string;
}

export class NarrativePlanner {
  plan(input: NarrativePlannerInput): NarrativeBlueprint {
    const runtime = input.projectDna.identity.estimatedRuntime;
    const avgSceneDuration = input.channelDna.story.pacingRules.averageSceneLength;
    const sceneCount = Math.max(6, Math.ceil(runtime / avgSceneDuration));

    const storyArc = this.buildStoryArc(input);
    const curiosityLoops = this.buildCuriosityLoops(input, sceneCount);
    const emotionCurve = this.buildEmotionCurve(input);
    const knowledgeCurve = this.buildKnowledgeCurve(input, sceneCount);
    const sceneObjectives = this.buildSceneObjectives(input, sceneCount, storyArc, emotionCurve);
    const revealPlan = this.buildRevealPlan(input, sceneCount);
    const pacingProfile = this.buildPacingProfile(input, sceneCount);
    const visualNarrativePlan = this.buildVisualNarrativePlan(input, sceneObjectives);
    const wordEmphasisList = this.buildWordEmphasisList(input, sceneObjectives);
    const viewerRetentionPlan = this.buildRetentionPlan(sceneObjectives);
    const visualSyncPlan = this.buildSyncPlan(sceneObjectives, visualNarrativePlan, wordEmphasisList, pacingProfile);

    return {
      mainTopic: input.projectDna.identity.topic,
      coreQuestion: this.extractCoreQuestion(input),
      coreMessage: input.projectDna.blueprint.coreMessage,
      learningGoal: input.projectDna.learningObjective,
      targetAudience: `${input.projectDna.audience.level} - ${input.projectDna.audience.ageGroup}`,
      runtime,
      sceneCount,
      storyStructure: input.channelDna.story.storyFormula || "three_act",
      finalReveal: revealPlan.mainReveal.content,
      ctaGoal: "subscribe_and_explore",

      storyArc,
      curiosityLoops,
      emotionCurve,
      knowledgeCurve,
      sceneObjectives,
      revealPlan,
      pacingProfile,
      visualNarrativePlan,
      wordEmphasisList,
      viewerRetentionPlan,
      visualSyncPlan,

      metadata: {
        id: crypto.randomUUID(),
        projectId: input.projectDna.metadata.id,
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        validated: false,
        validationScore: 0,
      },
    };
  }

  private buildStoryArc(input: NarrativePlannerInput): StoryArc {
    const objective = input.projectDna.storyObjective;
    const arcs: Record<string, StoryArc> = {
      explain: {
        phases: ["hook", "question", "curiosity", "investigation", "explanation", "evidence", "reveal", "summary", "cta"],
        description: "Hook → Question → Curiosity → Investigation → Explanation → Evidence → Reveal → Summary → CTA",
      },
      reveal: {
        phases: ["hook", "question", "curiosity", "investigation", "evidence", "reveal", "summary", "cta"],
        description: "Hook → Question → Curiosity → Investigation → Evidence → Reveal → Summary → CTA",
      },
      challenge_beliefs: {
        phases: ["hook", "question", "curiosity", "evidence", "reveal", "explanation", "summary", "cta"],
        description: "Hook → Question → Curiosity → Evidence → Reveal → Explanation → Summary → CTA",
      },
      teach: {
        phases: ["hook", "question", "explanation", "evidence", "explanation", "summary", "cta"],
        description: "Hook → Question → Explanation → Evidence → Explanation → Summary → CTA",
      },
      inspire: {
        phases: ["hook", "curiosity", "evidence", "reveal", "summary", "cta"],
        description: "Hook → Curiosity → Evidence → Reveal → Summary → CTA",
      },
    };

    return arcs[objective] || arcs.explain;
  }

  private buildCuriosityLoops(input: NarrativePlannerInput, sceneCount: number): CuriosityLoop[] {
    const loops: CuriosityLoop[] = [];
    const dnaRules = input.channelDna.story.curiosityRules;
    const maxLoops = dnaRules.maxConcurrentOpenLoops || 3;
    const loopFrequency = dnaRules.openLoopFrequency || 90;
    const scenesPerLoop = Math.max(2, Math.ceil(loopFrequency / 35));

    const mainQuestion = this.extractCoreQuestion(input);
    loops.push({
      id: crypto.randomUUID(),
      type: "open_loop",
      question: mainQuestion,
      openAtScene: 1,
      expectedCloseAtScene: sceneCount - 1,
      intensity: 10,
    });

    for (let i = 0; i < maxLoops - 1; i++) {
      const sceneIndex = 2 + i * scenesPerLoop;
      if (sceneIndex >= sceneCount - 1) break;

      loops.push({
        id: crypto.randomUUID(),
        type: "mini_question",
        question: `But how does this connect to ${input.projectDna.identity.primarySubject}?`,
        openAtScene: sceneIndex,
        expectedCloseAtScene: Math.min(sceneIndex + scenesPerLoop, sceneCount - 1),
        intensity: 7 - i,
      });
    }

    if (sceneCount > 8) {
      loops.push({
        id: crypto.randomUUID(),
        type: "pattern_interrupt",
        question: "Wait. That changes everything we thought we knew.",
        openAtScene: Math.floor(sceneCount * 0.5),
        expectedCloseAtScene: Math.floor(sceneCount * 0.6),
        intensity: 9,
      });
    }

    return loops;
  }

  private buildEmotionCurve(input: NarrativePlannerInput): EmotionPoint[] {
    const dnaCurve = input.channelDna.story.emotionCurve;
    if (dnaCurve && dnaCurve.length > 0) {
      return dnaCurve.map((p, i) => ({
        sceneIndex: Math.floor((i / dnaCurve.length) * 12) + 1,
        emotion: p.phase,
        intensity: p.intensity,
        duration: p.duration,
      }));
    }

    const projectEmotion = input.projectDna.coreEmotion;
    const templates: Record<string, EmotionPoint[]> = {
      curiosity: [
        { sceneIndex: 1, emotion: "curiosity", intensity: 8, duration: 30 },
        { sceneIndex: 3, emotion: "confusion", intensity: 4, duration: 45 },
        { sceneIndex: 6, emotion: "interest", intensity: 7, duration: 50 },
        { sceneIndex: 9, emotion: "understanding", intensity: 8, duration: 40 },
        { sceneIndex: 11, emotion: "wonder", intensity: 9, duration: 35 },
        { sceneIndex: 13, emotion: "satisfaction", intensity: 5, duration: 30 },
      ],
      wonder: [
        { sceneIndex: 1, emotion: "awe", intensity: 9, duration: 25 },
        { sceneIndex: 4, emotion: "curiosity", intensity: 7, duration: 50 },
        { sceneIndex: 7, emotion: "confusion", intensity: 5, duration: 40 },
        { sceneIndex: 10, emotion: "discovery", intensity: 9, duration: 35 },
        { sceneIndex: 12, emotion: "wonder", intensity: 10, duration: 45 },
      ],
    };

    return templates[projectEmotion] || templates.curiosity;
  }

  private buildKnowledgeCurve(input: NarrativePlannerInput, sceneCount: number): KnowledgeStep[] {
    const concepts = input.research.keyConcepts.slice(0, 5);
    const steps: KnowledgeStep[] = [];

    steps.push({ sceneIndex: 1, action: "introduce", concept: input.projectDna.identity.primarySubject, complexity: "low" });

    concepts.forEach((concept, i) => {
      const idx = Math.floor((i + 1) * (sceneCount / (concepts.length + 1)));
      if (idx < sceneCount) {
        steps.push({ sceneIndex: idx, action: "explain", concept, complexity: "medium" });
        if (i % 2 === 0) {
          steps.push({ sceneIndex: Math.min(idx + 1, sceneCount - 1), action: "visualize", concept, complexity: "low" });
        }
      }
    });

    steps.push({ sceneIndex: sceneCount - 2, action: "repeat", concept: input.projectDna.identity.primarySubject, complexity: "low" });
    steps.push({ sceneIndex: sceneCount, action: "finalize", concept: input.projectDna.identity.primarySubject, complexity: "medium" });

    return steps;
  }

  private buildSceneObjectives(
    input: NarrativePlannerInput,
    sceneCount: number,
    storyArc: StoryArc,
    emotionCurve: EmotionPoint[]
  ): SceneObjective[] {
    const objectives: SceneObjective[] = [];
    const phases = storyArc.phases;

    for (let i = 0; i < sceneCount; i++) {
      const phaseIndex = Math.min(
        Math.floor((i / sceneCount) * phases.length),
        phases.length - 1
      );
      const phase = phases[phaseIndex];
      const emotionPoint = emotionCurve.find(
        (e) => e.sceneIndex === i + 1
      );

      const purpose = this.phaseToPurpose(phase);
      const density = this.computeDensity(phase, i, sceneCount);

      objectives.push({
        sceneId: i + 1,
        purpose,
        goal: this.buildSceneGoal(phase, input, i),
        emotion: emotionPoint?.emotion || "curiosity",
        knowledge: input.projectDna.identity.primarySubject,
        importance: i === 0 || i === sceneCount - 1 || i === Math.floor(sceneCount * 0.7) ? 10 : 5,
        expectedDuration: input.channelDna.story.pacingRules.averageSceneLength,
        visualGoal: this.buildVisualGoal(phase, input),
        retentionGoal: this.buildRetentionGoal(phase),
        density,
        storyArcPhase: phase,
      });
    }

    return objectives;
  }

  private buildRevealPlan(input: NarrativePlannerInput, sceneCount: number): RevealPlan {
    const revealScene = Math.floor(sceneCount * 0.75);

    return {
      mainReveal: {
        content: input.projectDna.blueprint.coreMessage,
        sceneIndex: revealScene,
        emotionalTarget: input.projectDna.coreEmotion,
      },
      supportingReveals: [
        { content: `The connection between ${input.projectDna.identity.primarySubject} and ${input.projectDna.identity.secondarySubject || "related concepts"}`, sceneIndex: Math.floor(sceneCount * 0.4) },
        { content: `Evidence from ${input.research.sources[0] || "recent studies"}`, sceneIndex: Math.floor(sceneCount * 0.55) },
      ],
      miniReveals: input.research.keyConcepts.slice(0, 3).map((c, i) => ({
        content: `${c} plays a crucial role`,
        sceneIndex: Math.floor((i + 2) * (sceneCount / 4)),
      })),
      surpriseMoments: [
        { content: "What if everything we assumed was wrong?", sceneIndex: Math.floor(sceneCount * 0.5), intensity: 9 },
        { content: "This changes how we understand everything", sceneIndex: revealScene, intensity: 10 },
      ],
      emotionalPeaks: [1, revealScene, sceneCount],
    };
  }

  private buildPacingProfile(input: NarrativePlannerInput, sceneCount: number): PacingProfile {
    return {
      averageSentenceLength: input.channelDna.story.pacingRules.averageSentenceLength,
      sceneDurations: Array(sceneCount).fill(input.channelDna.story.pacingRules.averageSceneLength),
      visualHoldTime: input.channelDna.editing.holdDuration.maximum,
      transitionFrequency: 3,
      pauseFrequency: 2,
      informationRhythm: "wave",
    };
  }

  private buildVisualNarrativePlan(
    input: NarrativePlannerInput,
    objectives: SceneObjective[]
  ): VisualNarrativePlan[] {
    const plans: VisualNarrativePlan[] = [];
    const metaphors = input.projectDna.metaphorLibrary;

    for (const obj of objectives) {
      const plan: VisualNarrativePlan = {
        sceneIndex: obj.sceneId,
        visualType: this.scenePurposeToVisual(obj.purpose),
        description: obj.visualGoal,
        imageAction: "new_image",
      };

      if (obj.sceneId > 1 && obj.purpose === "explain" && obj.sceneId % 3 !== 0) {
        plan.imageAction = "reuse";
        plan.reuseReference = `scene_${obj.sceneId - 1}`;
      }
      if (obj.purpose === "reveal" || obj.purpose === "hook") {
        plan.imageAction = "new_image";
      }
      if (obj.density === "high" || obj.density === "very_high") {
        plan.imageAction = "symbolic_insert";
        const metaphor = metaphors[obj.sceneId % metaphors.length];
        if (metaphor) {
          plan.metaphorRef = metaphor.concept;
        }
      }

      plans.push(plan);
    }

    return plans;
  }

  private buildWordEmphasisList(
    input: NarrativePlannerInput,
    objectives: SceneObjective[]
  ): WordEmphasis[] {
    const words: WordEmphasis[] = [];
    const highImportance = objectives.filter((o) => o.importance >= 8);

    for (const obj of highImportance.slice(0, 8)) {
      words.push({
        word: this.extractKeyWord(obj.goal),
        category: "concept",
        sceneIndex: obj.sceneId,
        sentenceIndex: 0,
        importance: obj.importance,
        visualTemplate: `Word-level visual: "${this.extractKeyWord(obj.goal)}", minimalist text overlay, centered`,
      });
    }

    return words;
  }

  private buildRetentionPlan(objectives: SceneObjective[]): ViewerRetentionPlan {
    const riskPoints = [];

    for (const obj of objectives) {
      if (obj.density === "high" || obj.density === "very_high") {
        riskPoints.push({
          sceneIndex: obj.sceneId,
          risk: "info_overload" as const,
          probability: 0.7,
          recommendedAction: "Add visual support, simplify language, extend duration",
        });
      }
      if (obj.expectedDuration > 45) {
        riskPoints.push({
          sceneIndex: obj.sceneId,
          risk: "pace_slow" as const,
          probability: 0.6,
          recommendedAction: "Insert camera movement, word-level visual, or new scene",
        });
      }
      if (obj.sceneId > 3 && obj.sceneId % 4 === 0) {
        riskPoints.push({
          sceneIndex: obj.sceneId,
          risk: "attention_drop" as const,
          probability: 0.5,
          recommendedAction: "Add curiosity loop or pattern interrupt",
        });
      }
    }

    return { riskPoints };
  }

  private buildSyncPlan(
    objectives: SceneObjective[],
    visualPlan: VisualNarrativePlan[],
    wordEmphasis: WordEmphasis[],
    pacing: PacingProfile
  ): VisualSynchronizationPlan {
    const sentences: VisualSyncSentence[] = [];
    let totalDuration = 0;

    for (const obj of objectives) {
      const visual = visualPlan.find((v) => v.sceneIndex === obj.sceneId);
      const words = wordEmphasis.filter((w) => w.sceneIndex === obj.sceneId);
      const sentenceCount = Math.max(2, Math.ceil(obj.expectedDuration / 6));
      const sentenceDuration = obj.expectedDuration / sentenceCount;

      for (let s = 0; s < sentenceCount; s++) {
        const syncSentence: VisualSyncSentence = {
          text: `[Scene ${obj.sceneId} sentence ${s + 1}]`,
          estimatedDuration: sentenceDuration,
          sceneIndex: obj.sceneId,
          sceneType: obj.purpose,
          imageType: visual?.visualType || "generic",
          imageAction: s === 0 ? (visual?.imageAction || "new_image") : "none",
          motionSuggestion: this.motionForPurpose(obj.purpose),
          transitionSuggestion: this.transitionForPurpose(obj.purpose, s),
        };

        const wordForSentence = words.find((w) => w.sentenceIndex === s);
        if (wordForSentence) {
          syncSentence.wordInsertTiming = sentenceDuration * 0.5;
          syncSentence.wordInsertText = wordForSentence.word;
        }

        sentences.push(syncSentence);
        totalDuration += sentenceDuration;
      }
    }

    return { sentences, totalDuration };
  }

  private phaseToPurpose(phase: StoryArcPhase): ScenePurpose {
    const map: Record<StoryArcPhase, ScenePurpose> = {
      hook: "hook",
      question: "context",
      curiosity: "hook",
      investigation: "explain",
      explanation: "explain",
      evidence: "evidence",
      reveal: "reveal",
      summary: "summarize",
      cta: "cta",
    };
    return map[phase] || "explain";
  }

  private computeDensity(phase: StoryArcPhase, index: number, total: number): DensityScore {
    if (index === 0) return "low";
    if (index === total - 1) return "low";
    if (phase === "explanation" || phase === "evidence") return "high";
    if (phase === "reveal") return "medium";
    if (index > total * 0.3 && index < total * 0.7) return "medium";
    return "low";
  }

  private buildSceneGoal(phase: StoryArcPhase, input: NarrativePlannerInput, index: number): string {
    const goals: Record<StoryArcPhase, string> = {
      hook: `Hook the viewer with ${input.projectDna.coreEmotion} about ${input.projectDna.identity.primarySubject}`,
      question: `Establish the core question about ${input.projectDna.identity.topic}`,
      curiosity: `Deepen curiosity with unexpected angle on ${input.projectDna.identity.primarySubject}`,
      investigation: `Investigate the mechanisms behind ${input.projectDna.identity.primarySubject}`,
      explanation: `Explain how ${input.projectDna.identity.primarySubject} works`,
      evidence: `Present evidence supporting the explanation`,
      reveal: `Reveal the core message: ${input.projectDna.blueprint.coreMessage}`,
      summary: `Summarize key insights about ${input.projectDna.identity.topic}`,
      cta: `Call to action: continue exploring ${input.projectDna.metadata.channelDnaId}`,
    };
    return goals[phase] || `Explore ${input.projectDna.identity.topic}`;
  }

  private buildVisualGoal(phase: StoryArcPhase, input: NarrativePlannerInput): string {
    const goals: Record<StoryArcPhase, string> = {
      hook: `${input.projectDna.visualObjective} opening visual establishing ${input.projectDna.identity.topic}`,
      question: `Visual representation of the core question`,
      curiosity: `Symbolic visual creating curiosity gap`,
      investigation: `Scientific or analytical visual showing investigation`,
      explanation: `Clear explanatory visual of the concept`,
      evidence: `Data or evidence visualization`,
      reveal: `Dramatic reveal visual with emotional impact`,
      summary: `Summary visual tying all concepts together`,
      cta: `Closing visual with CTA`,
    };
    return goals[phase] || `${input.projectDna.visualObjective} visual for ${phase}`;
  }

  private buildRetentionGoal(phase: StoryArcPhase): string {
    const goals: Record<StoryArcPhase, string> = {
      hook: "Capture immediate attention",
      question: "Maintain curiosity",
      curiosity: "Keep viewer engaged",
      investigation: "Build anticipation",
      explanation: "Ensure understanding",
      evidence: "Build credibility",
      reveal: "Deliver satisfaction",
      summary: "Reinforce key points",
      cta: "Drive action",
    };
    return goals[phase] || "Maintain engagement";
  }

  private scenePurposeToVisual(purpose: ScenePurpose): string {
    const map: Record<ScenePurpose, string> = {
      hook: "establishing_shot",
      context: "contextual_visual",
      explain: "explanatory_diagram",
      reveal: "dramatic_reveal",
      transition: "transition_visual",
      reflect: "reflective_wide",
      summarize: "summary_graphic",
      cta: "cta_visual",
      evidence: "evidence_display",
    };
    return map[purpose] || "generic";
  }

  private extractCoreQuestion(input: NarrativePlannerInput): string {
    return input.projectDna.blueprint.coreQuestion || `Why does ${input.projectDna.identity.topic} matter?`;
  }

  private extractKeyWord(goal: string): string {
    const words = goal.split(" ");
    const filtered = words.filter(
      (w) => w.length > 4 && !["about", "with", "that", "this", "from"].includes(w.toLowerCase())
    );
    return filtered[0] || words[2] || "insight";
  }

  private motionForPurpose(purpose: ScenePurpose): string {
    const map: Record<ScenePurpose, string> = {
      hook: "slow_zoom_in",
      context: "gentle_pan",
      explain: "static_with_highlight",
      reveal: "dolly_in",
      transition: "crossfade_pan",
      reflect: "slow_pull_out",
      summarize: "gentle_pan",
      cta: "slow_zoom_out",
      evidence: "static_with_callout",
    };
    return map[purpose] || "gentle_pan";
  }

  private transitionForPurpose(purpose: ScenePurpose, sentenceIndex: number): string {
    if (sentenceIndex === 0) {
      const map: Partial<Record<ScenePurpose, string>> = {
        hook: "fade_in",
        reveal: "quick_cut",
        reflect: "fade_to_black",
        transition: "dissolve",
        cta: "fade_to_black",
      };
      return map[purpose] || "crossfade";
    }
    return "none";
  }
}
