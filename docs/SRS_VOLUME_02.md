# AI Documentary Studio
## Software Requirement Specification
## Volume 02 — AI Brain + Channel DNA + Project DNA + Narrative Planner

**Version:** 2.0
**Status:** Approved

---

# 1. OBJECTIVE

Create a universal **AI Brain** capable of understanding any documentary-style YouTube channel. The AI Brain learns a channel's identity through a reusable **Channel DNA** profile and a per-video **Project DNA** profile. It dynamically generates research, narrative blueprints, scripts, prompts, editing plans, and timelines — never relying on hardcoded prompts.

**The AI Brain is not a prompt generator. It is a decision engine.**

---

# 2. AI BRAIN ARCHITECTURE

The AI Brain consists of multiple independent intelligence modules that communicate through **structured JSON objects** (never plain text), keeping the pipeline modular, testable, and reliable.

## 2.1 Module Pipeline

```
Idea
  │
  ▼
Research Engine
  │
  ▼
Narrative Planner Engine         ◄── NEW CORE LAYER
  │
  ▼
Script Engine
  │
  ▼
Scene Engine
  │
  ▼
Prompt Engine
  │
  ▼
Editing Engine
  │
  ▼
Timeline Engine
  │
  ▼
Quality Engine
  │
  ▼
Export Engine
```

## 2.2 Two-Layer DNA Architecture

```
Global AI Brain
        │
        ▼
   Channel DNA          ◄── Channel-wide identity (permanent)
        │
        ▼
   Project DNA          ◄── Per-video personality (temporary override)
        │
        ▼
Narrative Planner
        │
        ▼
    Script
        │
        ▼
     Prompt
```

**Channel DNA** defines the channel's permanent identity — visual style, story structure, editing rhythm.

**Project DNA** defines the specific video's personality — topic-appropriate tone, pacing, emotional curve, visual metaphor language. A psychology video in a general documentary channel gets different Project DNA than a space video in the same channel.

Project DNA inherits from Channel DNA and allows selective overrides without modifying the parent profile.

## 2.3 Design Principles

- Every module works **independently**
- Every module communicates via **typed JSON contracts**
- No module depends on the output format of another — only on the **schema**
- Future modules are added without changing existing architecture
- The AI Brain must **validate** before passing data downstream
- If validation fails, the module must **rebuild** its output

---

# 3. CHANNEL DNA SYSTEM

The system supports **unlimited** Channel DNA profiles. Each DNA profile is a **structured knowledge package** — not just prompt text.

## 3.1 DNA Components

Every Channel DNA profile contains:

| Component | Purpose |
|-----------|---------|
| Story DNA | Controls script writing rules |
| Visual DNA | Defines how the audience sees the story |
| Prompt DNA | Rules for generating image prompts |
| Editing DNA | How videos should feel rhythmically |
| Audio DNA | Voice and sound design rules |
| Research DNA | Information gathering rules |
| Thumbnail DNA | Thumbnail generation rules |
| SEO DNA | Title, description, keyword rules |

## 3.2 DNA Manager — User Operations

Users must be able to:

| Operation | Description |
|-----------|-------------|
| Create DNA | Build a new profile from scratch |
| Duplicate DNA | Clone an existing profile |
| Export DNA | Download as JSON file |
| Import DNA | Upload a JSON profile |
| Share DNA | Generate shareable link |
| Version DNA | Track changes with version history |
| Set Default DNA | Assign a default for new projects |

## 3.3 DNA Metadata

Every DNA stores:

```json
{
  "id": "dna_channel_minddoc_v2",
  "name": "Mind Documentary",
  "description": "Psychology & neuroscience explainer style",
  "category": "psychology",
  "version": "2.1.0",
  "preview": "Minimalist stick-figure illustrations, clean flat-vector, cinematic framing",
  "createdAt": "2026-01-15T00:00:00Z",
  "updatedAt": "2026-07-01T00:00:00Z",
  "author": "user_id"
}
```

---

# 4. PROJECT DNA SYSTEM

A per-video DNA layer that sits **between** Channel DNA and the Narrative Planner.

## 4.1 Rationale

Two videos on the same channel often need different treatment:

| Video | Topic | Visual Approach | Pacing |
|-------|-------|-----------------|--------|
| "Why Your Brain Hates Silence" | Psychology | Brain close-ups, neural imagery | Slow, reflective |
| "The Fermi Paradox" | Space | Cosmic scale, mathematical symbols | Grand, sweeping |
| "How Money Controls Your Brain" | Finance × Psychology | Money visuals + brain metaphors | Fast, engaging |

Channel DNA alone cannot handle this variation. Project DNA provides per-video personality while inheriting the channel's identity.

## 4.2 Project DNA Structure

```json
{
  "id": "project_dna_abc123",
  "channelDnaId": "dna_channel_minddoc_v2",
  "videoTitle": "The Fermi Paradox",
  "overrides": {
    "story": {
      "hookFormula": "cosmic_scale",
      "storyStructure": "mystery_box",
      "averageSceneLength": 45
    },
    "visual": {
      "artStyle": "photorealistic_concept",
      "colorPalette": ["deep_space_blue", "nebula_purple", "star_white"],
      "cameraLanguage": "cinematic_wide"
    },
    "prompt": {
      "styleLockRules": ["photorealistic", "space_photography", "cinematic_lighting"],
      "cameraRules": ["wide_angle", "deep_focus"]
    },
    "editing": {
      "motionStyle": "slow_cinematic",
      "transitionRules": ["crossfade", "dissolve"]
    }
  }
}
```

## 4.3 Inheritance Rules

1. Project DNA **inherits** all values from Channel DNA by default
2. Only specified `overrides` fields are replaced
3. Unspecified fields fall back to Channel DNA
4. Project DNA cannot modify the Channel DNA source

---

# 5. NARRATIVE PLANNER ENGINE

The **Narrative Planner** is the first intelligence layer after the Research Engine. It is responsible for designing the complete storytelling strategy **before** script writing begins.

**The Script Engine must never generate scripts directly from research.**

## 5.1 Workflow Position

```
Research
  │
  ▼
Narrative Planner     ◄── YOU ARE HERE
  │
  ▼
Script Engine
```

## 5.2 Objectives

The Narrative Planner must determine:

| Objective | Description |
|-----------|-------------|
| Story Arc | The complete narrative shape (three-act, mystery box, etc.) |
| Curiosity Loop | Sequence of open loops and reveals |
| Emotional Curve | Emotional journey across the video timeline |
| Knowledge Curve | Information density and complexity progression |
| Scene Objectives | What each scene must accomplish |
| Reveal Timing | When and how each reveal happens |
| Open Loop Placement | Where to insert unresolved questions |
| Hook Strength | How compelling the opening is |
| Ending Strategy | How the video concludes |

## 5.3 Narrative Blueprint Output

Before any script is written, generate a structured **Narrative Blueprint**:

```json
{
  "storyGoal": "Explain the Fermi Paradox and its implications for humanity",
  "targetAudience": "Curious general audience, age 16-40",
  "coreMessage": "The universe appears empty because we haven't looked properly",
  "learningObjective": "Viewer understands the three major solutions to the Fermi Paradox",
  "emotionalJourney": [
    { "phase": "wonder", "duration": 30, "description": "Scale of the universe" },
    { "phase": "curiosity", "duration": 60, "description": "Where is everybody?" },
    { "phase": "confusion", "duration": 45, "description": "Contradicting theories" },
    { "phase": "discovery", "duration": 90, "description": "Possible explanations" },
    { "phase": "wonder", "duration": 45, "description": "The Great Filter" },
    { "phase": "satisfaction", "duration": 30, "description": "Conclusion and call to action" }
  ],
  "curiosityCurve": [
    { "time": 0, "curiosityLevel": 80, "event": "Opening hook" },
    { "time": 60, "curiosityLevel": 90, "event": "First open loop" },
    { "time": 180, "curiosityLevel": 70, "event": "First reveal" },
    { "time": 300, "curiosityLevel": 95, "event": "Final twist" }
  ],
  "sceneObjectives": [
    {
      "sceneNumber": 1,
      "purpose": "hook",
      "emotion": "awe",
      "informationDensity": "low",
      "expectedDuration": 20,
      "importance": 10,
      "visualComplexity": "high",
      "needVisualMetaphor": true,
      "needSymbolism": true,
      "needWordLevelVisual": false
    },
    {
      "sceneNumber": 2,
      "purpose": "context",
      "emotion": "curiosity",
      "informationDensity": "medium",
      "expectedDuration": 45,
      "importance": 8,
      "visualComplexity": "medium",
      "needVisualMetaphor": false,
      "needSymbolism": false,
      "needWordLevelVisual": true
    }
  ],
  "finalReveal": {
    "type": "philosophical_twist",
    "content": "The Great Filter might be in our future",
    "emotionalTarget": "wonder_tinged_with_fear"
  },
  "ctaObjective": "Subscribe to explore more cosmic mysteries"
}
```

## 5.4 Scene Planning

Every scene in the blueprint must carry:

| Field | Description |
|-------|-------------|
| sceneNumber | Position in sequence |
| purpose | `hook`, `context`, `explanation`, `reveal`, `transition`, `conclusion` |
| emotion | Emotional target for the scene |
| informationDensity | `low` / `medium` / `high` |
| expectedDuration | Target duration in seconds |
| importance | Scale 1-10 |
| visualComplexity | `low` / `medium` / `high` |
| needVisualMetaphor | Whether to use symbolic imagery |
| needSymbolism | Whether abstract concepts need visual representation |
| needWordLevelVisual | Whether to insert text/highlight visuals |

## 5.5 Emotional Timeline

Generate a complete emotion map for the video. Example:

```
Hook (awe)
  │
  ▼
Curiosity (intrigue)
  │
  ▼
Confusion (tension)
  │
  ▼
Discovery (excitement)
  │
  ▼
Understanding (clarity)
  │
  ▼
Wonder (awe)
  │
  ▼
Satisfaction (reward)
```

The Script Engine **must** follow this emotional path.

## 5.6 Curiosity Planner

Automatically insert:

| Technique | Description |
|-----------|-------------|
| Open Loops | Unanswered questions that build tension |
| Mini Questions | Small curiosities within a scene |
| Future References | "As we'll see later..." forward hooks |
| Delayed Answers | Withhold resolution intentionally |
| Pattern Interrupts | Break expected narrative flow |
| Psychological Hooks | Curiosity gaps, mystery bias, information gaps |

The user should **never** manually place curiosity loops.

## 5.7 Knowledge Planner

Before writing, the AI must determine:

1. What the viewer already knows (assumed baseline)
2. What needs explanation (new concepts)
3. What should be simplified (complex topics)
4. What should be visualized (abstract concepts → concrete visuals)

## 5.8 Visual Narrative Planning

Every scene receives a **visual intention** before prompt generation:

```json
{
  "sceneId": 4,
  "visualIntention": "symbolic",
  "visualSubject": "brain_neural_network",
  "metaphorTarget": "memory as archived files",
  "cameraFraming": "close_up_dolly_zoom",
  "motionSuggestion": "slow_push_in",
  "durationSuggestion": 12
}
```

Prompt generation must follow this plan — not invent its own visuals.

## 5.9 Reveal Planner

The AI must determine:

| Component | Description |
|-----------|-------------|
| Main Reveal | The central thesis reveal |
| Supporting Reveals | Secondary discoveries |
| Micro Reveals | Small satisfactions throughout |
| Surprise Moments | Unexpected twists |
| Emotional Peaks | Highest emotional intensity points |

**Reveal timing must never be random.** Each reveal is placed by the Narrative Planner.

## 5.10 Pacing Planner

Determine:

| Parameter | Description |
|-----------|-------------|
| Sentence Length | Average words per sentence |
| Scene Length | Average duration per scene |
| Image Duration | Average hold time per image |
| Information Density | Concepts per minute |
| Pause Placement | Where silence works best |
| Viewer Rest Time | Periods of low complexity |

## 5.11 Story Validation

Before sending data to the Script Engine, validate:

- Story Logic — Does the sequence make sense?
- Flow — Does one idea lead naturally to the next?
- Pacing — Is the rhythm appropriate?
- Emotional Consistency — Does the emotion map feel natural?
- Learning Progression — Is complexity increasing appropriately?
- Curiosity Progression — Are curiosity gaps maintained?

**If validation fails, rebuild the Narrative Blueprint.**

---

# 6. STORY DNA

Controls how scripts are written.

```json
{
  "hookFormula": "curiosity_gap",
  "curiosityPattern": "question_rise_loop",
  "storyStructure": "mystery_box",
  "emotionalCurve": [
    { "phase": "hook", "intensity": 8 },
    { "phase": "rise", "intensity": 6 },
    { "phase": "peak", "intensity": 9 },
    { "phase": "reveal", "intensity": 7 },
    { "phase": "satisfaction", "intensity": 5 }
  ],
  "revealStrategy": "delayed_layered",
  "ctaStyle": "curiosity_gap",
  "averageSentenceLength": 14,
  "averageSceneLength": 35,
  "readingDifficulty": "conversational",
  "pacingRules": {
    "fastScenes": ["hook", "conclusion"],
    "slowScenes": ["explanation", "reflection"],
    "minSceneDuration": 8,
    "maxSceneDuration": 60
  },
  "suspenseRules": {
    "maxOpenLoops": 3,
    "openLoopDuration": 120,
    "resolutionRequired": true
  },
  "openLoopRules": {
    "frequency": "every_90_seconds",
    "types": ["question", "future_reference", "pattern_interrupt"]
  },
  "scientificExplanationRules": {
    "analogyFirst": true,
    "simplifyBeforeDetail": true,
    "maxJargonPerScene": 2,
    "jargonDefinitionRequired": true
  }
}
```

---

# 7. VISUAL DNA

Defines how the audience sees the story.

```json
{
  "artStyle": "minimalist_flat_vector",
  "characterDesignRules": {
    "style": "stick_figure_clean",
    "proportions": "exaggerated_head",
    "consistency": "strict",
    "emotionDisplay": "exaggerated_expressions"
  },
  "backgroundRules": {
    "style": "clean_gradient",
    "complexity": "minimal",
    "focusShift": "character_or_center"
  },
  "compositionRules": {
    "ruleOfThirds": true,
    "centerFocus": true,
    "negativeSpace": "generous",
    "depthLayers": 2
  },
  "cameraLanguage": {
    "defaultAngle": "eye_level",
    "dramaticAngle": "low_angle",
    "intimateAngle": "close_up",
    "scaleAngle": "wide_establishing"
  },
  "lightingRules": {
    "default": "soft_diffuse",
    "dramatic": "hard_spotlight",
    "mood": "warm_ambient"
  },
  "colorPalette": {
    "primary": ["#2D3436", "#636E72"],
    "accent": ["#00B894", "#00CEC9"],
    "background": ["#DFE6E9", "#F5F6FA"],
    "moodMapping": {
      "curiosity": ["#00CEC9", "#81ECEC"],
      "tension": ["#E17055", "#D63031"],
      "discovery": ["#00B894", "#55EFC4"],
      "wonder": ["#6C5CE7", "#A29BFE"]
    }
  },
  "visualMetaphorRules": {
    "preference": "symbolic_over_literal",
    "library": {
      "memory": "filing_cabinet_brain",
      "time": "hourglass_galaxy",
      "knowledge": "lightbulb_network"
    }
  }
}
```

---

# 8. PROMPT DNA

**Must never contain fixed prompts.** Contains generation rules.

```json
{
  "promptTemplate": {
    "structure": "subject + action + environment + lighting + style + quality",
    "wordOrder": "significant_first"
  },
  "characterLockRules": {
    "enabled": true,
    "mode": "global_consistency",
    "fallback": "reuse_previous"
  },
  "styleLockRules": [
    "flat_vector_illustration",
    "clean_lines",
    "minimal_shading",
    "consistent_line_weight"
  ],
  "cameraRules": [
    "eye_level_for_conversation",
    "wide_for_context",
    "close_up_for_emotion",
    "dolly_zoom_for_reveal"
  ],
  "compositionRules": [
    "subject_centered",
    "negative_space_left",
    "rule_of_thirds_for_scenes"
  ],
  "lightingRules": [
    "soft_diffuse_default",
    "dramatic_spotlight_for_emphasis"
  ],
  "colorRules": {
    "mode": "from_palette",
    "dominantColor": "context_based",
    "accentRules": "emotional_mapping"
  },
  "negativePromptRules": [
    "photorealistic",
    "detailed_backgrounds",
    "text_in_image",
    "multiple_subjects",
    "clutter",
    "dark_mood"
  ],
  "qualityRules": {
    "minQuality": "standard",
    "maxQuality": "hd",
    "artifacts": "avoid"
  },
  "consistencyRules": {
    "characterMode": "global_consistent",
    "environmentMode": "maintain_throughout_scene",
    "styleMode": "strict"
  },
  "wordLevelPromptRules": {
    "enabled": true,
    "maxPerVideo": 5,
    "style": "minimal_clean_text_overlay"
  },
  "imageReuseRules": {
    "strategy": "prefer_reuse_over_new",
    "reuseThreshold": "meaning_change",
    "motionOnReuse": "camera_movement"
  }
}
```

---

# 9. EDITING DNA

Teaches the AI how videos should feel.

```json
{
  "motionStyle": "cinematic_slow",
  "zoomRules": {
    "default": "slow_push",
    "emphasis": "fast_push",
    "reflection": "slow_pull",
    "maxZoomSpeed": 0.05,
    "minZoomSpeed": 0.01
  },
  "panRules": {
    "enabled": true,
    "maxPanSpeed": 0.03,
    "panDirection": "left_to_right_default"
  },
  "holdDurationRules": {
    "minimumHold": 3,
    "maximumHold": 12,
    "complexImageHold": 8,
    "simpleImageHold": 4
  },
  "transitionRules": {
    "default": "crossfade",
    "sceneChange": "dissolve",
    "emphasis": "quick_cut",
    "reflection": "fade_to_black",
    "transitionDuration": 0.5
  },
  "cameraMotionRules": {
    "intro": "slow_zoom_in",
    "explanation": "gentle_pan",
    "reveal": "dolly_in",
    "conclusion": "slow_zoom_out"
  },
  "sceneRhythm": {
    "buildUp": "slow_to_fast",
    "climax": "fast",
    "resolution": "slow"
  },
  "emotionalEditingRules": {
    "curiosity": "slow_zooms_with_holds",
    "tension": "quick_cuts_and_shakes",
    "discovery": "smooth_dolly",
    "wonder": "wide_holds_with_slow_pan"
  }
}
```

---

# 10. AUDIO DNA

```json
{
  "preferredTTS": "elevenlabs",
  "voiceStyle": "warm_conversational",
  "voiceSpeed": 0.95,
  "pauseRules": {
    "afterHook": 1.5,
    "beforeReveal": 1.0,
    "afterReveal": 2.0,
    "emotionalPause": 1.5
  },
  "emotionalVoiceRules": {
    "curiosity": "rising_intonation",
    "tension": "lowered_volume_slower",
    "discovery": "excited_higher_pitch",
    "wonder": "reverent_quiet"
  },
  "silenceRules": {
    "maxSilence": 2.0,
    "purposefulSilence": true
  },
  "subtitleRules": {
    "enabled": true,
    "style": "minimal",
    "position": "bottom_center"
  },
  "timingRules": {
    "imageChangeBeforeVoice": 0.3,
    "pauseBetweenScenes": 0.5
  }
}
```

---

# 11. THUMBNAIL DNA

```json
{
  "thumbnailStyle": "curiosity_gap",
  "colorLanguage": "high_contrast",
  "composition": "face_close_up_left_text_right",
  "textPlacement": "right_third",
  "faceRules": {
    "expression": "surprise_or_curiosity",
    "position": "left_or_center",
    "scale": "large"
  },
  "objectScale": "oversized",
  "contrastRules": {
    "background": "dark_or_blurred",
    "foreground": "bright_and_sharp"
  },
  "curiosityRules": {
    "textHookStyle": "question_or_contrast",
    "maxWords": 4,
    "fontStyle": "bold_impact"
  }
}
```

---

# 12. SEO DNA

```json
{
  "titleFormula": "curiosity_gap_or_question",
  "titleMaxLength": 60,
  "descriptionFormula": "hook_summary_bullet_cta",
  "keywordStrategy": {
    "primaryKeyword": "topic_center",
    "secondaryKeywords": "related_concepts",
    "longTail": true
  },
  "hashtagRules": {
    "count": 3,
    "style": "broad_niche_broad"
  },
  "playlistRules": {
    "series": "auto_detect",
    "position": "chronological"
  },
  "endScreenRules": {
    "style": "suggested_videos",
    "cta": "subscribe_with_curiosity"
  }
}
```

---

# 13. RESEARCH DNA

```json
{
  "preferredSources": [
    "wikipedia_scientific",
    "published_papers",
    "expert_articles",
    "peer_reviewed_studies"
  ],
  "factVerificationRules": {
    "minSources": 2,
    "crossReference": true,
    "dateRecency": "5_years"
  },
  "citationRules": {
    "style": "conversational_reference",
    "visible": false
  },
  "analogyRules": {
    "preference": "everyday_examples",
    "complexity": "audience_appropriate"
  },
  "scientificTone": "accessible_but_accurate",
  "simplificationRules": {
    "maxTechnicalDepth": "high_school_level",
    "analogyFirst": true,
    "jargonDefinitionRequired": true
  },
  "audienceLevel": "general_curious"
}
```

---

# 14. AI BRAIN MEMORY SYSTEM

The AI Brain must maintain two types of memory.

## 14.1 Project Memory

Stores entities and concepts for **consistency within a single project**. Never carries into unrelated projects.

```json
{
  "mainCharacter": "human_brain",
  "supportingCharacters": ["neuron", "synapse", "amygdala"],
  "locations": ["neural_landscape", "memory_archive"],
  "keyConcepts": ["neuroplasticity", "dopamine_loop", "cognitive_bias"],
  "repeatedVisualMetaphors": {
    "brain": "control_center",
    "memory": "filing_cabinet",
    "emotion": "weather_system"
  },
  "terminology": {
    "neuroplasticity": "brain's ability to rewire itself",
    "dopamine": "reward chemical"
  },
  "storyProgression": {
    "completedScenes": [1, 2, 3],
    "currentOpenLoops": ["Why does silence feel uncomfortable?"],
    "resolvedQuestions": ["What happens in the brain when we hear silence?"]
  }
}
```

## 14.2 Narrative Memory

Stores the **story state** to prevent forgotten threads during long-form documentaries.

```json
{
  "storyArc": "mystery_box",
  "runningQuestions": [
    "Why does silence feel uncomfortable?",
    "What is the evolutionary purpose of sound?"
  ],
  "openLoops": [
    {
      "question": "Why does silence feel uncomfortable?",
      "openedAt": 30,
      "expectedCloseAt": 240,
      "type": "main_curiosity"
    }
  ],
  "solvedQuestions": [
    {
      "question": "What happens in the brain when we hear silence?",
      "answeredAt": 120,
      "answer": "Auditory cortex goes into prediction mode"
    }
  ],
  "emotionalProgression": {
    "currentEmotion": "curiosity",
    "emotionHistory": ["awe", "curiosity"]
  },
  "conceptProgression": [
    "auditory_cortex_basics",
    "prediction_coding",
    "evolutionary_adaptation"
  ]
}
```

---

# 15. SCRIPT ENGINE

## 15.1 Input / Output

```
Input:  Video Idea + Channel DNA + Project DNA + Narrative Blueprint
Output: Research Notes + Story Outline + Full Script + Scene Segmentation + Emotional Tags
```

## 15.2 Script Generation Rules

1. **Never write from research directly** — always use the Narrative Blueprint
2. Follow the emotional curve from the blueprint exactly
3. Insert curiosity loops at blueprint-specified positions
4. Respect Story DNA pacing rules
5. Each scene must map to the blueprint's scene objectives
6. Open loops must be resolved before the script ends
7. CTA must match the blueprint's CTA objective

## 15.3 Script Output Schema

```json
{
  "id": "script_abc123",
  "projectId": "proj_abc123",
  "title": "Why Your Brain Hates Silence",
  "overview": "A journey into the neuroscience of silence",
  "scenes": [
    {
      "sceneNumber": 1,
      "purpose": "hook",
      "emotion": "awe",
      "narration": "Close your eyes. Listen. What do you hear? Probably nothing. But your brain hears something else entirely.",
      "visualDescription": "Person sitting in a quiet room, camera slowly zooming into their ear",
      "expectedDuration": 15,
      "openLoopsInserted": ["What does silence do to the brain?"],
      "visualIntention": {
        "needMetaphor": false,
        "needSymbolism": true,
        "cameraFraming": "close_up_to_extreme_close_up"
      }
    }
  ],
  "metadata": {
    "totalDuration": 480,
    "totalScenes": 12,
    "averageSceneDuration": 40,
    "hookScore": 9,
    "curiosityScore": 8
  }
}
```

---

# 16. SCENE ENGINE

## 16.1 Function

Automatically identify for each script segment:

| Decision | Options |
|----------|---------|
| Scene Start | Timestamp in script |
| Scene End | Timestamp in script |
| Scene Purpose | hook / context / explain / reveal / transition / conclusion |
| Emotion | awe / curiosity / confusion / discovery / wonder / satisfaction |
| Visual Priority | 1-10 |
| Need New Image? | boolean |
| Reuse Existing Image? | boolean + reference |
| Need Word-level Visual? | boolean |
| Suggested Camera Framing | wide / medium / close_up / extreme_close_up |

## 16.2 Scene Reuse Logic

- If the visual meaning hasn't changed significantly → reuse previous image with camera movement
- If the story introduces a new concept → generate new image
- If the scene purpose shifts → evaluate based on visual DNA's `imageReuseRules`

---

# 17. PROMPT ENGINE

## 17.1 Inputs

- Script (with scene segmentation)
- Scene Engine output
- Prompt DNA
- Visual DNA
- Project Memory
- Narrative Memory

## 17.2 Output Per Scene

```json
{
  "sceneId": 4,
  "sceneNumber": 4,
  "prompt": "A minimalist flat vector illustration of a human brain as a control center with neural pathways lighting up, clean lines, soft blue and teal color palette, centered composition, soft diffuse lighting, white background with gradient",
  "negativePrompt": "photorealistic, detailed background, text, multiple subjects, clutter, dark mood",
  "cameraSuggestion": "dolly_zoom_from_wide_to_close",
  "motionSuggestion": "slow_push_in_with_gentle_pan",
  "reuseSuggestion": {
    "reuse": false,
    "reason": "new_concept_introduced"
  },
  "durationSuggestion": 10,
  "qualityGate": {
    "styleConsistency": 95,
    "characterConsistency": 100,
    "visualClarity": 90,
    "passed": true
  }
}
```

## 17.3 Prompt Generation Rules

1. Follow Prompt DNA structure exactly
2. Apply Visual DNA color palette to every prompt
3. Enforce character consistency from Project Memory
4. Respect reuse rules — do not generate if reuse is better
5. Add camera framing from Scene Engine
6. Append quality suffixes from Prompt DNA
7. Never override the Narrative Planner's visual intention

---

# 18. QUALITY ENGINE

## 18.1 Validation Gates

Before approving **any** module output, validate:

### Story Quality
| Check | Description |
|-------|-------------|
| Story Consistency | Does every scene serve the story goal? |
| Character Consistency | Are characters visually and narratively consistent? |
| Visual Consistency | Do visuals match the DNA color/style rules? |
| Prompt Consistency | Do prompts follow DNA rules? |
| Style Consistency | Is the overall style uniform? |
| Logical Flow | Does one idea lead naturally to the next? |
| Scene Pacing | Is rhythm appropriate for the content? |

### Narrative Quality (NEW)
| Check | Description |
|-------|-------------|
| Hook Score | How compelling is the opening? (1-10) |
| Curiosity Score | How well are curiosity gaps maintained? (1-10) |
| Story Flow Score | Narrative coherence? (1-10) |
| Emotional Flow Score | Does the emotion map feel natural? (1-10) |
| Learning Score | Is information well-paced? (1-10) |
| Retention Score | Will viewers stay till the end? (1-10) |
| Overall Narrative Score | Composite out of 100 |

## 18.2 Failure Handling

If any validation fails:
1. Log the failed check and score
2. Return the output to the originating module with failure reasons
3. The originating module must rebuild its output
4. The rebuild is re-validated before passing downstream

---

# 19. COMPLETE WORKFLOW

```
┌─────────────────────────────────────────────────────────────┐
│                         IDEA                                │
│  User enters a video idea (text, URL, or voice note)        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     RESEARCH ENGINE                         │
│  • Gather facts, sources, analogies                         │
│  • Follow Research DNA                                      │
│  • Output: Research Notes + Source List                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 NARRATIVE PLANNER ENGINE                    │
│  • Determine story arc, emotional curve, reveal timing      │
│  • Generate Narrative Blueprint                             │
│  • Validate blueprint                                       │
│  • Output: Narrative Blueprint + Scene Objectives           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      SCRIPT ENGINE                          │
│  • Write full script following Narrative Blueprint          │
│  • Insert curiosity loops at planned positions              │
│  • Respect Story DNA rules                                  │
│  • Validate script quality                                  │
│  • Output: Full Script + Scene Segmentation                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      SCENE ENGINE                           │
│  • Analyze each scene for visual needs                      │
│  • Determine reuse vs new image                             │
│  • Suggest camera framing and motion                        │
│  • Output: Scene Analysis + Visual Intentions               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     PROMPT ENGINE                           │
│  • Generate prompts using Prompt DNA + Visual DNA           │
│  • Enforce character/style consistency                      │
│  • Apply reuse logic                                        │
│  • Validate prompt quality                                  │
│  • Output: Prompt Pack (prompts per scene)                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   IMAGE GENERATION (EXTERNAL)               │
│  • Send prompts to Google Flow / Imagen / provider          │
│  • User uploads generated images back to the app            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     EDITING ENGINE                          │
│  • Apply Editing DNA rules to every scene                   │
│  • Generate motion plan (zooms, pans, transitions)          │
│  • Output: Editing Plan per scene                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    TIMELINE ENGINE                          │
│  • Sync visuals to voiceover                                │
│  • Apply timing rules from Audio DNA                        │
│  • Build complete timeline                                  │
│  • Output: Timeline JSON + Preview                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    RENDERER + EXPORT                        │
│  • Render final video                                       │
│  • Apply Export settings                                    │
│  • Output: MP4 video file                                   │
└─────────────────────────────────────────────────────────────┘
```

---

# 20. MODULE INTERFACE CONTRACTS

Every module communicates via typed JSON interfaces. Below are the core contracts.

## 20.1 ResearchEngine → NarrativePlanner

```json
{
  "sources": [
    {
      "url": "https://...",
      "title": "The Neuroscience of Silence",
      "relevance": 9,
      "keyFindings": ["silence activates default mode network"],
      "verified": true
    }
  ],
  "keyConcepts": [
    {
      "term": "Default Mode Network",
      "definition": "Brain network active during rest",
      "simplified": "Brain's idle state"
    }
  ],
  "analogies": [
    {
      "concept": "auditory prediction",
      "analogy": "brain as prediction machine",
      "everydayExample": "Jumping at unexpected silence"
    }
  ]
}
```

## 20.2 NarrativePlanner → ScriptEngine

```json
{
  "blueprint": { "... Narrative Blueprint schema ..." },
  "sceneObjectives": [ "... Scene Objective schema ..." ],
  "emotionalTimeline": [ "... Emotional Timeline schema ..." ],
  "validationPassed": true,
  "narrativeScore": 87
}
```

## 20.3 ScriptEngine → SceneEngine

```json
{
  "script": { "... Script schema ..." },
  "scenes": [ "... Scene schema ..." ]
}
```

## 20.4 SceneEngine → PromptEngine

```json
{
  "scenes": [
    {
      "sceneNumber": 4,
      "narration": "...",
      "visualIntention": {
        "subject": "neural_network",
        "metaphor": "city_network",
        "camera": "dolly_zoom",
        "motion": "slow_push",
        "reuse": false
      },
      "framing": "extreme_close_up"
    }
  ]
}
```

---

# 21. JSON MODULE INTERFACES SUMMARY

| From | To | Contract Schema |
|------|----|-----------------|
| User | App | Idea (text) |
| App | Research Engine | Idea + Channel DNA + Project DNA |
| Research Engine | Narrative Planner | ResearchNotes |
| Narrative Planner | Script Engine | NarrativeBlueprint |
| Script Engine | Scene Engine | Script + SceneSegments |
| Scene Engine | Prompt Engine | SceneAnalysis + VisualIntentions |
| Prompt Engine | External | PromptPack |
| External | App | Image URLs |
| App | Editing Engine | Images + Script + Editing DNA |
| Editing Engine | Timeline Engine | EditingPlan |
| Timeline Engine | Renderer | TimelineJSON |

---

# 22. APPENDIX — ZENN-STYLE MIND DOCUMENTARY DNA (STARTING PROFILE)

The application ships with one example profile.

## Story Characteristics
- Strong curiosity hook
- Psychology + neuroscience explanations
- Short, conversational sentences (avg 14 words)
- Frequent open loops (every 90 seconds)
- Clear reveal before conclusion

## Visual Characteristics
- Minimalist stick-figure illustrations
- Clean flat-vector look
- Consistent line weight
- Limited color palette (teal, blue, warm grays)
- Simple backgrounds with strong focal points
- Cinematic framing despite minimal art

## Prompt Rules
- Character consistency across scenes (same stick-figure style)
- Environment consistency per scene
- Avoid unnecessary visual clutter
- Prioritize symbolic visuals over literal ones
- Reuse images with camera movement when meaning is stable

## Editing Style
- Slow cinematic zooms for reflective moments (0.01-0.03 speed)
- Faster pushes during reveals (0.05 speed)
- Word-level visual inserts only for high-impact concepts (max 5 per video)
- Smooth transitions (crossfade/dissolve)

---

*End of Volume 02 — AI Brain + Channel DNA + Project DNA + Narrative Planner*
