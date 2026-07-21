import type {
  VisualDNAProfile, ArtStyleDefinition, CharacterDNA, EnvironmentDNA,
  ColorLanguage, LightingDNA, CameraDNA, CompositionDNA, VisualMetaphor,
  VisualPriorityProfile, VisualRhythmProfile, ImageReuseProfile, VisualGrammar,
} from "./types.js";

export function createZennProfile(channelDnaId: string): VisualDNAProfile {
  return {
    art: artStyle(),
    character: characterDNA(),
    environment: environmentDNA(),
    colors: colorLanguage(),
    lighting: lightingDNA(),
    camera: cameraDNA(),
    composition: compositionDNA(),
    metaphors: metaphorLibrary(),
    priority: priorityProfile(),
    complexity: "simple",
    rhythm: rhythmProfile(),
    reuse: reuseProfile(),
    grammar: visualGrammar(),
    metadata: {
      id: `vda_zenn_${Date.now()}`,
      channelDnaId,
      name: "Zenn-style Documentary",
      version: "1.0",
      createdAt: new Date().toISOString(),
    },
  };
}

function artStyle(): ArtStyleDefinition {
  return {
    technique: "vector_flat",
    rendering: "flat",
    illustration: "minimal flat vector illustration with clean geometric shapes",
    outline: "thin_black",
    texture: "none",
    shadow: "soft_drop",
    depth: "subtle_layers",
    background: "gradient",
    qualityTarget: "clean, readable, consistent",
  };
}

function characterDNA(): CharacterDNA {
  return {
    id: "zenn_stickfigure",
    body: "stick_figure",
    headShape: "circle",
    poseStyle: "gesturing",
    expression: "minimal_abstract",
    gestures: ["pointing", "spreading_arms", "holding", "walking"],
    walkingStyle: "simple_bounce",
    emotionStyle: {
      curiosity: "head_tilt",
      surprise: "arms_up",
      calm: "hands_down",
      wonder: "looking_up",
    },
    scale: 1.0,
    silhouette: "simple_human_outline",
  };
}

function environmentDNA(): EnvironmentDNA {
  return {
    type: "abstract_space",
    objectDensity: "minimal",
    backgroundComplexity: "gradient",
    perspective: "2d_flat",
    indoorRules: ["soft_warm_background", "minimal_furniture"],
    outdoorRules: ["open_sky_gradient", "simple_horizon"],
    depthRules: ["flat_projection", "subtle_layer_separation"],
    negativeSpaceRules: ["generous_top_space", "balanced_side_margins"],
  };
}

function colorLanguage(): ColorLanguage {
  return {
    primary: ["#4A90D9", "#2C3E50"],
    secondary: ["#7F8C8D", "#BDC3C7"],
    accent: ["#E74C3C", "#F1C40F", "#2ECC71"],
    danger: ["#E74C3C"],
    success: ["#2ECC71"],
    neutral: ["#ECF0F1", "#95A5A6"],
    night: ["#1A1A2E", "#16213E", "#0F3460"],
    day: ["#F5F7FA", "#E8ECF1", "#D5DBE0"],
  };
}

function lightingDNA(): LightingDNA {
  return {
    direction: "ambient",
    intensity: "soft",
    mood: "calm",
    temperature: "neutral_warm",
    shadowDensity: "light",
    highlightRules: ["soft_edge_highlight", "no_harsh_highlight"],
    backlightRules: ["subtle_rim_when_needed"],
    ambient: "soft_diffuse_ambient",
  };
}

function cameraDNA(): CameraDNA {
  return {
    default: "medium_shot",
    wide: "wide establishing shot showing full context",
    medium: "medium shot focusing on subject and immediate surroundings",
    closeUp: "close up on subject with minimal background",
    extremeCloseUp: "extreme close up on specific detail or expression",
    topView: "top down view for abstract concepts",
    sideView: "side profile view for explanation sequences",
    perspectiveRules: ["maintain_2d_flat", "no_foreshortening", "stable_framing"],
  };
}

function compositionDNA(): CompositionDNA {
  return {
    defaultRule: "centered",
    rules: ["centered", "negative_space", "rule_of_thirds", "balanced"],
    leadingLines: false,
    negativeSpace: "generous on top and sides",
    balance: "symmetrical for concepts, asymmetrical for emotion",
    eyeDirection: "subject faces center, looking toward content",
    readingFlow: "left_to_right",
    objectPlacement: "center_primary, edges_for_context",
  };
}

function metaphorLibrary(): VisualMetaphor[] {
  return [
    { concept: "memory", symbol: "Archive", description: "A glowing archive or library shelf", visualStyle: "minimal_icon", animationPreference: "slow_reveal", cameraPreference: "medium_shot", emotionMapping: { curiosity: "warm_glow", surprise: "bright_flash" }, reuseAllowed: true },
    { concept: "identity", symbol: "Mirror", description: "A simple mirror reflecting a figure", visualStyle: "minimal_scene", animationPreference: "gentle_ripple", cameraPreference: "close_up", emotionMapping: { reflection: "soft_fade", mystery: "fog" }, reuseAllowed: true },
    { concept: "fear", symbol: "Shadow", description: "A dark shadowy figure looming", visualStyle: "minimal_dark", animationPreference: "slow_grow", cameraPreference: "wide_shot", emotionMapping: { fear: "darken", suspense: "pulsing" }, reuseAllowed: true },
    { concept: "hope", symbol: "Sunrise", description: "Sun rising over a simple horizon", visualStyle: "minimal_gradient", animationPreference: "slow_brighten", cameraPreference: "wide_shot", emotionMapping: { hope: "warm_glow", calm: "gentle" }, reuseAllowed: true },
    { concept: "freedom", symbol: "Open Sky", description: "Open sky with flowing lines", visualStyle: "minimal_abstract", animationPreference: "expanding", cameraPreference: "wide_shot", emotionMapping: { wonder: "expanding", hope: "bright" }, reuseAllowed: true },
    { concept: "control", symbol: "Puppet Strings", description: "Strings attached to a figure", visualStyle: "minimal_line", animationPreference: "tugging", cameraPreference: "close_up", emotionMapping: { urgency: "pulling", reflection: "still" }, reuseAllowed: true },
    { concept: "time", symbol: "Hourglass", description: "Sand flowing in an hourglass", visualStyle: "minimal_icon", animationPreference: "slow_flow", cameraPreference: "close_up", emotionMapping: { calm: "steady", urgency: "fast" }, reuseAllowed: true },
    { concept: "stress", symbol: "Cracks", description: "Cracks spreading across a surface", visualStyle: "minimal_texture", animationPreference: "spreading", cameraPreference: "extreme_close_up", emotionMapping: { urgency: "fast_spread", fear: "deepening" }, reuseAllowed: true },
    { concept: "focus", symbol: "Spotlight", description: "A single beam of light on a subject", visualStyle: "minimal_lighting", animationPreference: "slow_center", cameraPreference: "close_up", emotionMapping: { curiosity: "narrowing", reflection: "gentle" }, reuseAllowed: true },
    { concept: "habits", symbol: "Circular Loop", description: "Figure walking in a circular path", visualStyle: "minimal_loop", animationPreference: "looping", cameraPreference: "top_view", emotionMapping: { reflection: "slow", urgency: "fast" }, reuseAllowed: true },
    { concept: "dopamine", symbol: "Glowing Pulse", description: "A glowing pulsing dot in dark space", visualStyle: "minimal_glow", animationPreference: "pulsing", cameraPreference: "extreme_close_up", emotionMapping: { curiosity: "brighten", surprise: "flash" }, reuseAllowed: true },
    { concept: "silence", symbol: "Empty Room", description: "An empty room with soft light", visualStyle: "minimal_space", animationPreference: "still", cameraPreference: "wide_shot", emotionMapping: { calm: "still", reflection: "slow_fade" }, reuseAllowed: true },
  ];
}

function priorityProfile(): VisualPriorityProfile {
  return {
    critical: { newImage: true, composition: "strong_centered", detail: "high", minScreenTime: 6 },
    high: { newImage: true, composition: "balanced", detail: "medium", minScreenTime: 4 },
    medium: { newImage: false, composition: "standard", detail: "medium", minScreenTime: 3 },
    low: { newImage: false, composition: "simple", detail: "low", minScreenTime: 2 },
  };
}

function rhythmProfile(): VisualRhythmProfile {
  return {
    pattern: ["wide_shot", "medium_shot", "close_up", "medium_shot", "extreme_close_up", "wide_shot"],
    avoidRepetition: true,
    minVariety: 3,
  };
}

function reuseProfile(): ImageReuseProfile {
  return {
    holdDuringExplanation: true,
    slowZoomForReflection: true,
    panForContinuation: true,
    newOnMeaningChange: true,
    maxReuseBeforeNew: 4,
  };
}

function visualGrammar(): VisualGrammar {
  return {
    rules: [
      { from: "master_scene", to: "supporting_scene", allowedTransitions: ["continue", "zoom_in", "pan_left", "pan_right"], preferredTransition: "continue" },
      { from: "supporting_scene", to: "master_scene", allowedTransitions: ["zoom_out", "return", "new_scene"], preferredTransition: "return" },
      { from: "master_scene", to: "word_visual", allowedTransitions: ["word_insert"], preferredTransition: "word_insert" },
      { from: "word_visual", to: "master_scene", allowedTransitions: ["return", "new_scene"], preferredTransition: "return" },
      { from: "master_scene", to: "symbolic_visual", allowedTransitions: ["crossfade", "zoom_in"], preferredTransition: "crossfade" },
      { from: "symbolic_visual", to: "master_scene", allowedTransitions: ["return", "zoom_out"], preferredTransition: "return" },
      { from: "master_scene", to: "transition_visual", allowedTransitions: ["fade_out", "crossfade"], preferredTransition: "fade_out" },
    ],
    defaultTransition: "continue",
    enforceContinuity: true,
  };
}
