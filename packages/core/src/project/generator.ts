import type { ChannelDNA } from "../dna/types.js";
import type {
  ProjectDNA, ProjectIntelligenceProfile, ProjectBlueprint,
  VisualMetaphorEntry, NarrativeMemory, ImageStrategy, ProjectPacingProfile,
  CameraLanguage, ProjectColorLanguage, AudioObjective, AudienceProfile,
  CoreEmotion, StoryObjective, VisualObjective, EditingObjective,
} from "./types.js";

export interface ProjectGeneratorInput {
  projectName: string;
  topic: string;
  idea: string;
  channelDna: ChannelDNA;
  research: {
    keyConcepts: string[];
    targetAudience?: string;
    difficulty?: string;
  };
}

export class ProjectDNAGenerator {
  generate(input: ProjectGeneratorInput): ProjectDNA {
    const identity = this.buildIdentity(input);
    const audience = this.buildAudience(input);
    const coreEmotion = this.detectCoreEmotion(input);
    const learningObjective = this.buildLearningObjective(input);
    const storyObjective = this.detectStoryObjective(input);
    const visualObjective = this.detectVisualObjective(input, coreEmotion);
    const editingObjective = this.detectEditingObjective(input, coreEmotion);
    const metaphorLibrary = this.buildMetaphorLibrary(input);
    const colorLanguage = this.buildColorLanguage(coreEmotion, input.channelDna);
    const cameraLanguage = this.buildCameraLanguage(coreEmotion);
    const pacing = this.buildPacingProfile(input, editingObjective);
    const imageStrategy = this.buildImageStrategy(input);
    const narrativeMemory = this.buildNarrativeMemory(input);
    const intelligence = this.buildIntelligenceProfile(coreEmotion, input.channelDna);

    const blueprint: ProjectBlueprint = {
      videoGoal: this.buildVideoGoal(input),
      coreQuestion: this.buildCoreQuestion(input),
      coreMessage: this.buildCoreMessage(input),
      learningObjective,
      emotionTimeline: this.buildEmotionTimeline(coreEmotion),
      storyArc: input.channelDna.story.storyFormula || "three_act",
      visualIdentity: visualObjective,
      editingIdentity: editingObjective,
      estimatedRuntime: input.channelDna.general.defaultRuntime || 480,
      sceneCount: Math.ceil((input.channelDna.general.defaultRuntime || 480) /
        input.channelDna.story.pacingRules.averageSceneLength),
      approved: false,
    };

    const quality = {
      minimumStoryScore: 80,
      minimumPromptScore: 80,
      minimumVisualScore: 80,
      minimumRetentionScore: 75,
      minimumTimelineScore: 85,
    };

    return {
      identity,
      audience,
      coreEmotion,
      learningObjective,
      storyObjective,
      visualObjective,
      editingObjective,
      audio: this.buildAudioObjective(coreEmotion),
      metaphorLibrary,
      colorLanguage,
      cameraLanguage,
      pacing,
      imageStrategy,
      narrativeMemory,
      intelligence,
      quality,
      blueprint,
      metadata: {
        id: crypto.randomUUID(),
        channelDnaId: input.channelDna.metadata.id,
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        changeLog: ["Auto-generated from idea"],
      },
    };
  }

  private buildIdentity(input: ProjectGeneratorInput) {
    return {
      projectName: input.projectName,
      topic: input.topic,
      category: input.channelDna.metadata.category,
      keywords: input.topic.split(" ").concat(input.research.keyConcepts.slice(0, 5)),
      primarySubject: input.research.keyConcepts[0] || input.topic,
      secondarySubject: input.research.keyConcepts[1],
      difficulty: (input.research.difficulty as "beginner" | "intermediate" | "advanced") || "beginner",
      estimatedRuntime: input.channelDna.general.defaultRuntime || 480,
      language: input.channelDna.metadata.language || "en",
    };
  }

  private buildAudience(input: ProjectGeneratorInput): AudienceProfile {
    return {
      level: (input.research.difficulty as "beginner" | "intermediate" | "advanced") || "beginner",
      ageGroup: input.channelDna.general.targetAudience?.includes("40") ? "35-44" : "18-24",
      viewingIntent: "learn",
      watchMotivation: "curiosity",
      expectedKnowledge: "none",
    };
  }

  private detectCoreEmotion(input: ProjectGeneratorInput): CoreEmotion {
    const idea = input.idea.toLowerCase();
    const topic = input.topic.toLowerCase();

    if (idea.includes("why") || idea.includes("how")) return "curiosity";
    if (idea.includes("scary") || idea.includes("danger") || idea.includes("threat")) return "fear";
    if (idea.includes("amazing") || idea.includes("universe") || idea.includes("cosmos")) return "wonder";
    if (idea.includes("hope") || idea.includes("future") || idea.includes("solution")) return "hope";
    if (idea.includes("mystery") || idea.includes("unknown") || idea.includes("unsolved")) return "mystery";
    if (idea.includes("urgent") || idea.includes("deadline") || idea.includes("crisis")) return "urgency";
    if (idea.includes("quiet") || idea.includes("silence") || idea.includes("peace")) return "reflection";
    if (idea.includes("brain") || idea.includes("mind") || idea.includes("psychology")) return "curiosity";
    if (idea.includes("space") || idea.includes("cosmos") || idea.includes("infinite")) return "wonder";

    return "curiosity";
  }

  private buildLearningObjective(input: ProjectGeneratorInput): string {
    return `Viewer understands ${input.topic} through the lens of ${input.channelDna.metadata.category}`;
  }

  private detectStoryObjective(input: ProjectGeneratorInput): StoryObjective {
    const idea = input.idea.toLowerCase();
    if (idea.includes("why") || idea.includes("how")) return "explain";
    if (idea.includes("what if") || idea.includes("imagine")) return "challenge_beliefs";
    if (idea.includes("compare") || idea.includes("vs") || idea.includes("versus")) return "compare";
    if (idea.includes("secret") || idea.includes("hidden") || idea.includes("truth")) return "reveal";
    if (idea.includes("guide") || idea.includes("learn") || idea.includes("step")) return "teach";
    if (idea.includes("incredible") || idea.includes("amazing") || idea.includes("beautiful")) return "inspire";
    return "explain";
  }

  private detectVisualObjective(input: ProjectGeneratorInput, emotion: CoreEmotion): VisualObjective {
    if (emotion === "wonder" || emotion === "mystery") return "cinematic";
    if (emotion === "fear" || emotion === "urgency") return "emotional";
    if (emotion === "calm" || emotion === "reflection") return "minimal";
    if (input.channelDna.visual.artStyle.includes("minimal")) return "symbolic";
    return "metaphorical";
  }

  private detectEditingObjective(input: ProjectGeneratorInput, emotion: CoreEmotion): EditingObjective {
    if (emotion === "wonder" || emotion === "reflection") return "slow_documentary";
    if (emotion === "urgency" || emotion === "fear") return "fast_documentary";
    if (emotion === "curiosity") return "explainer";
    if (emotion === "calm") return "cinematic";
    return "educational";
  }

  private buildMetaphorLibrary(input: ProjectGeneratorInput): VisualMetaphorEntry[] {
    const channelSymbols = input.channelDna.visualLibrary.symbols || {};
    const metaphors: VisualMetaphorEntry[] = [];

    for (const [concept, sym] of Object.entries(channelSymbols)) {
      const entry = sym as { visual?: string; usage?: string; promptTemplate?: string };
      metaphors.push({
        concept,
        metaphor: entry.visual || concept,
        description: entry.usage || `Visual representation of ${concept}`,
        promptTemplate: entry.promptTemplate || `Visual metaphor for ${concept}`,
      });
    }

    const topicConcepts = input.research.keyConcepts.slice(0, 3);
    for (const concept of topicConcepts) {
      if (!metaphors.find((m) => m.concept === concept)) {
        metaphors.push({
          concept,
          metaphor: concept,
          description: `Visual representation of ${concept}`,
          promptTemplate: `Symbolic visualization of ${concept}, flat vector, clean lines`,
        });
      }
    }

    return metaphors;
  }

  private buildColorLanguage(emotion: CoreEmotion, channelDna: ChannelDNA): ProjectColorLanguage {
    const channelColors = channelDna.visual.colorPalette;
    const moodColors = channelColors.moodMapping[emotion] || channelColors.accent;

    return {
      dominant: moodColors,
      accent: channelColors.accent,
      background: channelColors.background,
      emotion,
    };
  }

  private buildCameraLanguage(emotion: CoreEmotion): CameraLanguage {
    return {
      reflection: "slow_close_up",
      explanation: "medium_shot",
      concept: "wide_shot",
      emotion: "extreme_close_up",
      default: "eye_level",
    };
  }

  private buildPacingProfile(
    input: ProjectGeneratorInput,
    editingObjective: EditingObjective
  ): ProjectPacingProfile {
    const basePacing = input.channelDna.story.pacingRules;
    const densityMap: Record<EditingObjective, number> = {
      slow_documentary: 2,
      fast_documentary: 6,
      explainer: 4,
      educational: 3,
      cinematic: 2,
      minimal: 2,
      dynamic: 5,
    };

    return {
      averageSceneDuration: basePacing.averageSceneLength,
      informationDensity: densityMap[editingObjective] || 3,
      pauseFrequency: editingObjective === "slow_documentary" ? 4 : 2,
      transitionFrequency: editingObjective === "fast_documentary" ? 8 : 3,
      zoomFrequency: editingObjective === "cinematic" ? 6 : 3,
      motionFrequency: editingObjective === "dynamic" ? 7 : 3,
    };
  }

  private buildImageStrategy(input: ProjectGeneratorInput): ImageStrategy {
    const totalRuntime = input.channelDna.general.defaultRuntime || 480;
    const avgSceneLength = input.channelDna.story.pacingRules.averageSceneLength || 35;
    const sceneCount = Math.ceil(totalRuntime / avgSceneLength);

    return {
      maxNewImages: Math.ceil(sceneCount * 0.7),
      maxImageReuse: Math.ceil(sceneCount * 0.3),
      wordLevelImages: Math.min(5, Math.ceil(sceneCount * 0.15)),
      conceptImages: Math.ceil(sceneCount * 0.3),
      sceneImages: sceneCount,
      backgroundImages: Math.ceil(sceneCount * 0.2),
    };
  }

  private buildNarrativeMemory(input: ProjectGeneratorInput): NarrativeMemory {
    return {
      mainQuestion: this.buildCoreQuestion(input),
      miniQuestions: [],
      solvedQuestions: [],
      pendingReveals: [],
      sceneProgression: {
        total: 0,
        completed: [],
        currentIndex: 0,
      },
      emotionalProgression: [],
    };
  }

  private buildIntelligenceProfile(
    emotion: CoreEmotion,
    channelDna: ChannelDNA
  ): ProjectIntelligenceProfile {
    const avoidList: string[] = [
      "overuse_of_new_images",
      "repetitive_camera_angles",
      "weak_hooks",
      "long_static_scenes",
      "excessive_transitions",
      "visual_clutter",
    ];

    if (emotion === "calm" || emotion === "reflection") {
      avoidList.push("fast_cuts", "rapid_motion");
    }
    if (emotion === "urgency" || emotion === "fear") {
      avoidList.push("slow_pacing", "long_holds");
    }

    const preferredPatterns: string[] = [
      "reuse_images_when_meaning_stays_same",
      "word_level_visuals_only_for_high_impact",
      "prefer_symbolic_over_literal",
      "vary_scene_rhythm",
      "maintain_emotional_continuity",
    ];

    if (channelDna.prompt.imageReuseRules.strategy === "prefer_reuse") {
      preferredPatterns.unshift("reuse_images_with_camera_movement");
    }

    const riskDetection = [
      {
        risk: "attention_drop",
        severity: "high" as const,
        condition: "scene_duration > max_hold * 2",
        action: "insert_visual_change_or_motion",
      },
      {
        risk: "story_repetition",
        severity: "medium" as const,
        condition: "same_concept_in_consecutive_scenes",
        action: "merge_or_remove_duplicate",
      },
      {
        risk: "prompt_inconsistency",
        severity: "high" as const,
        condition: "style_drift_detected",
        action: "regenerate_prompt_with_dna_rules",
      },
      {
        risk: "character_drift",
        severity: "high" as const,
        condition: "character_appearance_changed",
        action: "revert_to_last_consistent_character",
      },
      {
        risk: "visual_overload",
        severity: "medium" as const,
        condition: "image_complexity > threshold",
        action: "simplify_or_replace_image",
      },
      {
        risk: "slow_pacing",
        severity: "low" as const,
        condition: "information_density < minimum",
        action: "add_visual_or_narrative_accelerator",
      },
    ];

    return { avoidList, preferredPatterns, riskDetection };
  }

  private buildAudioObjective(emotion: CoreEmotion): AudioObjective {
    const emotionConfig: Record<CoreEmotion, Partial<AudioObjective>> = {
      curiosity: { voiceEnergy: "high", speakingSpeed: "normal", pauseFrequency: "normal" },
      fear: { voiceEnergy: "medium", speakingSpeed: "slow", pauseFrequency: "many" },
      wonder: { voiceEnergy: "low", speakingSpeed: "slow", pauseFrequency: "many" },
      hope: { voiceEnergy: "medium", speakingSpeed: "normal", pauseFrequency: "normal" },
      suspense: { voiceEnergy: "low", speakingSpeed: "slow", pauseFrequency: "many" },
      calm: { voiceEnergy: "low", speakingSpeed: "slow", pauseFrequency: "few" },
      mystery: { voiceEnergy: "medium", speakingSpeed: "slow", pauseFrequency: "many" },
      urgency: { voiceEnergy: "high", speakingSpeed: "fast", pauseFrequency: "few" },
      reflection: { voiceEnergy: "low", speakingSpeed: "slow", pauseFrequency: "many" },
    };

    return {
      voiceEnergy: "medium",
      speakingSpeed: "normal",
      pauseFrequency: "normal",
      emotion,
      silenceUsage: "moderate",
      subtitleDensity: "key_points",
      ...emotionConfig[emotion],
    };
  }

  private buildVideoGoal(input: ProjectGeneratorInput): string {
    return `Create a ${input.channelDna.metadata.category} documentary explaining ${input.topic}`;
  }

  private buildCoreQuestion(input: ProjectGeneratorInput): string {
    return input.idea.length > 120 ? input.idea.slice(0, 120) + "..." : input.idea;
  }

  private buildCoreMessage(input: ProjectGeneratorInput): string {
    return `${input.topic} reveals fundamental insights about ${input.channelDna.metadata.category}`;
  }

  private buildEmotionTimeline(coreEmotion: CoreEmotion) {
    const baseDuration = 60;
    const timelines: Record<CoreEmotion, ProjectBlueprint["emotionTimeline"]> = {
      curiosity: [
        { phase: "hook", emotion: "curiosity", duration: 20, intensity: 8 },
        { phase: "explore", emotion: "wonder", duration: 40, intensity: 6 },
        { phase: "depth", emotion: "mystery", duration: 45, intensity: 4 },
        { phase: "discovery", emotion: "curiosity", duration: 35, intensity: 9 },
        { phase: "insight", emotion: "calm", duration: 30, intensity: 5 },
      ],
      fear: [
        { phase: "hook", emotion: "fear", duration: 15, intensity: 9 },
        { phase: "build", emotion: "suspense", duration: 50, intensity: 7 },
        { phase: "peak", emotion: "fear", duration: 25, intensity: 10 },
        { phase: "relief", emotion: "calm", duration: 40, intensity: 4 },
        { phase: "resolution", emotion: "hope", duration: 30, intensity: 6 },
      ],
      wonder: [
        { phase: "hook", emotion: "wonder", duration: 25, intensity: 9 },
        { phase: "scale", emotion: "curiosity", duration: 50, intensity: 7 },
        { phase: "depth", emotion: "mystery", duration: 40, intensity: 5 },
        { phase: "realization", emotion: "wonder", duration: 35, intensity: 8 },
        { phase: "reflection", emotion: "calm", duration: 30, intensity: 4 },
      ],
      hope: [
        { phase: "problem", emotion: "fear", duration: 30, intensity: 5 },
        { phase: "search", emotion: "curiosity", duration: 45, intensity: 7 },
        { phase: "discovery", emotion: "wonder", duration: 35, intensity: 8 },
        { phase: "solution", emotion: "hope", duration: 40, intensity: 9 },
        { phase: "call", emotion: "calm", duration: 20, intensity: 5 },
      ],
      suspense: [
        { phase: "setup", emotion: "curiosity", duration: 20, intensity: 6 },
        { phase: "build", emotion: "suspense", duration: 50, intensity: 8 },
        { phase: "peak", emotion: "fear", duration: 20, intensity: 10 },
        { phase: "reveal", emotion: "wonder", duration: 30, intensity: 7 },
        { phase: "aftermath", emotion: "reflection", duration: 30, intensity: 4 },
      ],
      calm: [
        { phase: "welcome", emotion: "calm", duration: 20, intensity: 4 },
        { phase: "explore", emotion: "curiosity", duration: 50, intensity: 5 },
        { phase: "depth", emotion: "wonder", duration: 40, intensity: 6 },
        { phase: "insight", emotion: "calm", duration: 35, intensity: 5 },
        { phase: "close", emotion: "reflection", duration: 25, intensity: 4 },
      ],
      mystery: [
        { phase: "hook", emotion: "mystery", duration: 20, intensity: 8 },
        { phase: "clues", emotion: "curiosity", duration: 50, intensity: 7 },
        { phase: "confusion", emotion: "suspense", duration: 30, intensity: 6 },
        { phase: "breakthrough", emotion: "wonder", duration: 25, intensity: 9 },
        { phase: "answer", emotion: "calm", duration: 35, intensity: 5 },
      ],
      urgency: [
        { phase: "crisis", emotion: "urgency", duration: 15, intensity: 9 },
        { phase: "countdown", emotion: "fear", duration: 40, intensity: 8 },
        { phase: "struggle", emotion: "suspense", duration: 35, intensity: 7 },
        { phase: "resolution", emotion: "hope", duration: 30, intensity: 8 },
        { phase: "relief", emotion: "calm", duration: 20, intensity: 4 },
      ],
      reflection: [
        { phase: "stillness", emotion: "reflection", duration: 25, intensity: 4 },
        { phase: "memory", emotion: "curiosity", duration: 45, intensity: 5 },
        { phase: "understanding", emotion: "wonder", duration: 40, intensity: 7 },
        { phase: "acceptance", emotion: "calm", duration: 35, intensity: 6 },
        { phase: "wisdom", emotion: "reflection", duration: 25, intensity: 5 },
      ],
    };

    return timelines[coreEmotion] || timelines.curiosity;
  }
}
