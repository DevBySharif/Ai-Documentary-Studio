import type { ChannelDNA } from "../dna/types.js";

export const mindDocumentaryDNA: ChannelDNA = {
  metadata: {
    id: "dna_mind_documentary_v1",
    name: "Mind Documentary",
    description: "Psychology & neuroscience explainer style — minimalist stick-figure illustrations with cinematic framing",
    category: "psychology",
    language: "en",
    version: "1.0.0",
    tags: ["psychology", "neuroscience", "explainer", "minimalist", "stick-figure"],
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    changeLog: ["Initial release"],
  },

  general: {
    channelName: "Mind Documentary",
    targetAudience: "Curious general audience, 16-40",
    averageVideoLength: 480,
    uploadFrequency: "2 per week",
    writingDifficulty: "conversational",
    defaultRuntime: 480,
  },

  story: {
    storyFormula: "mystery_box",
    hookFormula: "curiosity_gap",
    ctaFormula: "curiosity_gap",
    curiosityRules: {
      openLoopFrequency: 90,
      openLoopTypes: ["question", "future_reference", "pattern_interrupt"],
      maxConcurrentOpenLoops: 3,
    },
    revealRules: {
      timing: "delayed_layered",
      layering: "micro_before_macro",
      finalRevealStyle: "philosophical_twist",
    },
    openLoopRules: {
      maxOpenLoops: 3,
      resolutionRequired: true,
      defaultResolutionTime: 120,
    },
    pacingRules: {
      averageSentenceLength: 14,
      averageSceneLength: 35,
      minSceneDuration: 8,
      maxSceneDuration: 60,
      fastScenes: ["hook", "conclusion"],
      slowScenes: ["explanation", "reflection"],
    },
    emotionCurve: [
      { phase: "hook", duration: 20, intensity: 8 },
      { phase: "curiosity", duration: 60, intensity: 6 },
      { phase: "confusion", duration: 45, intensity: 4 },
      { phase: "discovery", duration: 90, intensity: 7 },
      { phase: "wonder", duration: 45, intensity: 9 },
      { phase: "satisfaction", duration: 30, intensity: 5 },
    ],
    paragraphStyle: "short_paragraphs_single_sentences",
    informationDensity: 3,
    questionStyle: ["rhetorical", "pattern_interrupt", "direct"],
    scientificStyle: {
      analogyFirst: true,
      simplifyBeforeDetail: true,
      maxJargonPerScene: 2,
      jargonDefinitionRequired: true,
    },
  },

  visual: {
    artStyle: "minimalist_flat_vector",
    characterStyle: "stick_figure_clean_exaggerated_head",
    environmentStyle: "minimal_abstract",
    backgroundStyle: "clean_gradient",
    objectStyle: "flat_outlined",
    cameraLanguage: {
      default: "eye_level",
      dramatic: "low_angle",
      intimate: "close_up",
      scale: "wide_establishing",
    },
    composition: "rule_of_thirds_center_focus",
    lighting: {
      default: "soft_diffuse",
      dramatic: "hard_spotlight",
      mood: "warm_ambient",
    },
    colorPalette: {
      primary: ["#2D3436", "#636E72"],
      accent: ["#00B894", "#00CEC9"],
      background: ["#DFE6E9", "#F5F6FA"],
      moodMapping: {
        curiosity: ["#00CEC9", "#81ECEC"],
        tension: ["#E17055", "#D63031"],
        discovery: ["#00B894", "#55EFC4"],
        wonder: ["#6C5CE7", "#A29BFE"],
      },
    },
    outlineThickness: "thin",
    negativeSpace: "generous",
    perspective: "2d_flat",
    visualSymbolism: {
      memory: "filing_cabinet_brain",
      time: "hourglass_galaxy",
      knowledge: "lightbulb_network",
      emotion: "weather_system",
      brain: "control_center_neural_network",
    },
  },

  prompt: {
    characterLock: {
      enabled: true,
      mode: "global_consistent",
      fallback: "reuse_previous_describe_same",
    },
    styleLock: {
      enabled: true,
      mode: "strict",
      rules: [
        "flat_vector_illustration",
        "clean_lines",
        "no_shading",
        "consistent_line_weight",
      ],
    },
    cameraRules: [
      "eye_level_for_conversation",
      "wide_for_context",
      "close_up_for_emotion",
      "dolly_zoom_for_reveal",
    ],
    lightingRules: [
      "soft_diffuse_default",
      "dramatic_spotlight_for_emphasis",
    ],
    compositionRules: [
      "subject_centered",
      "negative_space_left",
      "rule_of_thirds_for_scenes",
    ],
    promptPrefix: "Minimalist flat vector illustration, clean lines, soft colors, ",
    promptSuffix: ", simple background, centered composition, high quality, 4k",
    negativePrompt: [
      "photorealistic",
      "detailed_background",
      "text_in_image",
      "multiple_subjects",
      "clutter",
      "dark_mood",
      "shadows",
      "complex_lighting",
    ],
    consistencyRules: {
      characterMode: "global_consistent",
      environmentMode: "maintain_throughout_scene",
      styleMode: "strict",
    },
    imageReuseRules: {
      strategy: "prefer_reuse",
      reuseThreshold: "meaning_change",
      motionOnReuse: "camera_movement",
    },
    wordPromptRules: {
      enabled: true,
      maxPerVideo: 5,
      style: "minimal_clean_text_overlay",
    },
    scenePromptRules: {
      hook: "Dramatic wide shot establishing concept, symbolic opening visual",
      explanation: "Clear illustration of concept, subject centered with minimal background",
      reveal: "Close-up of subject with dramatic lighting, emphasis on detail",
      reflection: "Wide shot with slow atmosphere, softer colors",
      conclusion: "Return to opening visual with new context, bookend composition",
    },
  },

  editing: {
    cameraMotion: {
      default: "slow_push",
      emphasis: "fast_push",
      reflection: "slow_pull",
      reveal: "dolly_in",
    },
    zoomRules: {
      slowSpeed: 0.01,
      fastSpeed: 0.05,
      defaultDirection: "in",
      emotionMapping: {
        curiosity: { speed: 0.02, direction: "in" },
        tension: { speed: 0.04, direction: "in" },
        discovery: { speed: 0.03, direction: "in" },
        wonder: { speed: 0.01, direction: "out" },
        satisfaction: { speed: 0.01, direction: "out" },
      },
    },
    panRules: {
      enabled: true,
      maxSpeed: 0.03,
      defaultDirection: "left_to_right",
    },
    pushRules: {
      intensity: 0.7,
      timing: "during_reveal",
    },
    pullRules: {
      speed: 0.01,
      useFor: ["reflection", "conclusion"],
    },
    parallax: {
      enabled: true,
      depthLayers: 2,
      speedRatio: 0.5,
    },
    holdDuration: {
      minimum: 3,
      maximum: 12,
      complexImage: 8,
      simpleImage: 4,
    },
    transitionStyle: {
      default: "crossfade",
      sceneChange: "dissolve",
      emphasis: "quick_cut",
      reflection: "fade_to_black",
      duration: 0.5,
    },
    sceneRhythm: {
      buildUp: "slow_to_fast",
      climax: "fast",
      resolution: "slow",
    },
    viewerRetentionStyle: "alternate_complexity_with_rest",
    emotionMapping: {
      curiosity: { motion: "slow_zoom", transition: "crossfade", holdDuration: 6 },
      tension: { motion: "quick_push", transition: "quick_cut", holdDuration: 3 },
      discovery: { motion: "dolly_in", transition: "dissolve", holdDuration: 5 },
      wonder: { motion: "slow_pull", transition: "fade_to_black", holdDuration: 10 },
      satisfaction: { motion: "gentle_pan", transition: "crossfade", holdDuration: 8 },
    },
  },

  research: {
    preferredSources: [
      "wikipedia_scientific",
      "published_papers",
      "expert_articles",
      "peer_reviewed_studies",
    ],
    factChecking: {
      minSources: 2,
      crossReference: true,
      dateRecency: "5_years",
    },
    scientificAccuracy: "accessible",
    analogyStyle: "everyday",
    simplificationRules: {
      maxTechnicalDepth: "high_school_level",
      analogyFirst: true,
      jargonDefinitionRequired: true,
    },
    citationRules: {
      style: "conversational_reference",
      visible: false,
    },
    explanationStyle: "conversational",
  },

  audio: {
    preferredVoice: {
      provider: "elevenlabs",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      model: "eleven_multilingual_v2",
    },
    speechSpeed: 0.95,
    speechEmotion: {
      curiosity: { speed: 1.0, pitch: 1.05, style: "rising_intonation" },
      tension: { speed: 0.85, pitch: 0.95, style: "lowered_volume_slower" },
      discovery: { speed: 1.1, pitch: 1.1, style: "excited_higher_pitch" },
      wonder: { speed: 0.8, pitch: 0.9, style: "reverent_quiet" },
    },
    pauseRules: {
      afterHook: 1.5,
      beforeReveal: 1.0,
      afterReveal: 2.0,
      emotionalPause: 1.5,
      comma: 0.3,
      period: 0.5,
    },
    subtitleRules: {
      enabled: true,
      style: "minimal",
      position: "bottom_center",
      animation: "fade_in",
    },
    narrationStyle: "warm",
  },

  thumbnail: {
    formula: "curiosity_gap_face_close_up",
    color: {
      style: "high_contrast",
      palette: ["#00B894", "#2D3436", "#FFFFFF"],
      contrast: "high",
    },
    composition: "face_close_up_left_text_right",
    textPlacement: {
      position: "right_third",
      maxWords: 4,
      font: "bold_sans_serif",
      fontSize: "large",
    },
    objectSize: "oversized",
    emotion: ["surprise", "curiosity"],
    clickTrigger: "curiosity_gap_question",
  },

  seo: {
    titleFormula: "curiosity_gap_question",
    titleMaxLength: 60,
    descriptionFormula: "hook_summary_bullet_cta",
    keywordFormula: {
      primary: "topic_center",
      secondary: "related_concepts",
      longTail: true,
    },
    hashtags: {
      count: 3,
      style: "broad_niche_broad",
    },
    playlistStrategy: "series_auto_detect_chronological",
    tags: ["psychology", "neuroscience", "brain", "explained", "documentary"],
  },

  quality: {
    thresholds: {
      characterConsistency: 95,
      artStyleConsistency: 95,
      promptQuality: 90,
      storyFlow: 95,
      timelineAccuracy: 98,
    },
    onFailure: "regenerate",
  },

  visualLibrary: {
    characters: [
      {
        id: "char_default",
        name: "Default Stick Figure",
        description: "Minimalist stick figure with clean lines, round head, simple body",
        traits: ["minimal", "clean", "expressive_eyes"],
        promptSeed: "stick figure character, minimalist flat vector, clean lines, round head",
      },
    ],
    objects: [
      {
        id: "obj_brain",
        name: "Brain",
        category: "anatomy",
        promptTemplate: "Simplified brain illustration, flat vector, neural pathways, clean lines",
      },
      {
        id: "obj_neuron",
        name: "Neuron",
        category: "anatomy",
        promptTemplate: "Single neuron illustration, dendrites and axon, flat vector, clean lines",
      },
    ],
    backgrounds: [
      {
        id: "bg_gradient_light",
        name: "Light Gradient",
        style: "gradient",
        promptTemplate: "Soft gradient background, light colors, minimal, clean",
      },
    ],
    environments: [
      {
        id: "env_neural",
        name: "Neural Landscape",
        description: "Abstract neural network environment",
        promptTemplate: "Abstract neural landscape, floating neurons, soft colors, minimal",
      },
    ],
    symbols: {
      memory: {
        visual: "filing cabinet shaped like a brain",
        promptTemplate: "Brain-shaped filing cabinet with labeled drawers, flat vector, clean lines",
        usage: "Use when explaining memory formation and retrieval",
      },
      time: {
        visual: "hourglass with galaxy inside",
        promptTemplate: "Hourglass containing miniature galaxy, flat vector, symbolic, clean lines",
        usage: "Use when discussing time scales or evolution",
      },
      knowledge: {
        visual: "lightbulb with network connections",
        promptTemplate: "Lightbulb connected to neural network nodes, flat vector, clean lines, symbolic",
        usage: "Use when introducing new concepts or insights",
      },
    },
    cameras: [
      { name: "conversation", angle: "eye_level", distance: "medium", lens: "50mm" },
      { name: "emphasis", angle: "low_angle", distance: "close", lens: "85mm" },
      { name: "context", angle: "high_angle", distance: "wide", lens: "24mm" },
      { name: "intimate", angle: "eye_level", distance: "extreme_close", lens: "100mm" },
    ],
  },

  promptLibrary: {
    templates: [
      {
        id: "pt_hook",
        name: "hook",
        category: "opening",
        template: "Wide establishing shot of {subject}, symbolic representation, minimalist flat vector, clean lines",
        variables: ["subject"],
      },
      {
        id: "pt_brain",
        name: "brain",
        category: "anatomy",
        template: "Simplified brain illustration showing {concept}, neural pathways highlighted in {color}, flat vector",
        variables: ["concept", "color"],
      },
      {
        id: "pt_memory",
        name: "memory",
        category: "concept",
        template: "Visual metaphor for memory: brain-shaped filing cabinet with labeled storage drawers, flat vector",
        variables: [],
      },
      {
        id: "pt_closeup",
        name: "close-up",
        category: "shot",
        template: "Extreme close-up of {subject}, detailed view, soft lighting, minimalist background",
        variables: ["subject"],
      },
    ],
  },

  motionLibrary: {
    presets: [
      {
        id: "motion_thinking",
        name: "Thinking",
        narrativeFunction: "thinking",
        motionType: "slow_zoom",
        parameters: { speed: 0.01, direction: "in", easing: "ease_in_out" },
        duration: 8,
      },
      {
        id: "motion_research",
        name: "Research",
        narrativeFunction: "research",
        motionType: "camera_push",
        parameters: { speed: 0.03, direction: "forward", intensity: 0.6 },
        duration: 5,
      },
      {
        id: "motion_reveal",
        name: "Reveal",
        narrativeFunction: "reveal",
        motionType: "light_sweep",
        parameters: { speed: 0.04, direction: "left_to_right", lightIntensity: 0.8 },
        duration: 3,
      },
      {
        id: "motion_memory",
        name: "Memory",
        narrativeFunction: "memory",
        motionType: "floating_particles",
        parameters: { density: 0.3, speed: 0.02, floatDirection: "up" },
        duration: 6,
      },
      {
        id: "motion_discovery",
        name: "Discovery",
        narrativeFunction: "discovery",
        motionType: "dolly_in",
        parameters: { speed: 0.03, target: "subject", easing: "ease_out" },
        duration: 4,
      },
      {
        id: "motion_conclusion",
        name: "Conclusion",
        narrativeFunction: "conclusion",
        motionType: "slow_pull_out",
        parameters: { speed: 0.008, easing: "ease_in", finalZoom: 1.5 },
        duration: 10,
      },
    ],
  },

  knowledgeBase: {
    domains: [
      {
        name: "neuroscience",
        concepts: [
          {
            term: "Neuroplasticity",
            definition: "The brain's ability to reorganize itself by forming new neural connections throughout life",
            simplified: "Your brain can rewire itself like updating software",
            relatedTerms: ["synaptic pruning", "long-term potentiation"],
            visualMetaphor: "brain_with_wires_rewiring",
          },
          {
            term: "Default Mode Network",
            definition: "A network of brain regions active when the mind is at rest and wandering",
            simplified: "Your brain's idle mode — like a car idling at a stoplight",
            relatedTerms: ["mind wandering", "self-reflection"],
            visualMetaphor: "brain_network_glowing_in_rest",
          },
          {
            term: "Dopamine",
            definition: "A neurotransmitter associated with reward, motivation, and pleasure",
            simplified: "Your brain's reward chemical — like getting a gold star",
            relatedTerms: ["reward pathway", "addiction"],
            visualMetaphor: "sparkles_in_brain_reward_center",
          },
        ],
      },
      {
        name: "psychology",
        concepts: [
          {
            term: "Cognitive Bias",
            definition: "Systematic pattern of deviation from norm or rationality in judgment",
            simplified: "Your brain's mental shortcut that sometimes leads you wrong",
            relatedTerms: ["confirmation bias", "availability heuristic"],
            visualMetaphor: "crooked_lens_between_eye_and_brain",
          },
          {
            term: "Curiosity Gap",
            definition: "The gap between what you know and what you want to know",
            simplified: "The itch your brain feels when it needs to know something",
            relatedTerms: ["information gap theory", "epistemic curiosity"],
            visualMetaphor: "open_door_with_light_coming_through",
          },
        ],
      },
    ],
  },
};
