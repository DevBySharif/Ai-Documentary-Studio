# AI Documentary Studio
## Software Requirement Specification
## Volume 02 — Part 04 — Narrative Planner Engine

**Version:** 1.0
**Status:** Critical
**Priority:** Highest

---

# 1. OBJECTIVE

The **Narrative Planner** is responsible for designing the entire storytelling strategy before any script is written. The Script Engine must never generate a script directly from research. Instead, every project must first pass through the Narrative Planner. The Narrative Planner functions as the **Documentary Director**.

---

# 2. POSITION IN PIPELINE

```
User Idea → Research Engine → Channel DNA → Project DNA → Narrative Planner → Script Engine
```

---

# 3. PRIMARY RESPONSIBILITIES

- Story Design
- Learning Design
- Emotional Design
- Curiosity Design
- Scene Design
- Reveal Design
- Viewer Retention Design

---

# 4. NARRATIVE BLUEPRINT

Generate a **Narrative Blueprint** before writing. The blueprint contains:

- Main Topic
- Core Question
- Core Message
- Learning Goal
- Target Audience
- Runtime
- Scene Count
- Story Structure
- Final Reveal
- CTA Goal

This blueprint becomes the **single source of truth** for the entire project.

---

# 5. STORY ARC PLANNER

Determine the complete story arc before script generation:

```
Hook → Question → Curiosity → Investigation → Scientific Explanation → Evidence → Reveal → Summary → CTA
```

The Script Engine must strictly follow this structure.

---

# 6. CURIOSITY PLANNER

Automatically plan:

- Open Loops
- Mini Questions
- Delayed Answers
- Pattern Interrupts
- Curiosity Peaks
- Curiosity Releases

No manual placement should be required.

---

# 7. EMOTIONAL CURVE

Generate an emotional journey:

```
Curiosity → Confusion → Interest → Understanding → Wonder → Satisfaction
```

Motion, voice, visuals, and pacing must align with this curve.

---

# 8. KNOWLEDGE CURVE

Decide:
- What the viewer already knows
- What should be introduced
- What requires explanation
- What should be visualized
- What should be repeated
- Final understanding

This prevents overwhelming the viewer.

---

# 9. SCENE OBJECTIVE PLANNER

Every scene must have a clear purpose. Each scene stores:

- Scene ID
- Goal
- Emotion
- Knowledge
- Importance
- Expected Duration
- Visual Goal
- Retention Goal

No scene is allowed without a defined objective.

---

# 10. INFORMATION DENSITY

Each scene receives a density score: Low | Medium | High | Very High

High-density scenes must automatically include:
- Simpler language
- More visual support
- Longer screen time

---

# 11. REVEAL PLANNER

Decide:
- Main Reveal
- Supporting Reveals
- Mini Reveals
- Surprise Moments
- Emotional Peaks

The final reveal should feel earned.

---

# 12. PACING PLANNER

Determine:
- Average Sentence Length
- Scene Duration
- Visual Hold Time
- Transition Frequency
- Pause Frequency
- Information Rhythm

Avoid repetitive pacing.

---

# 13. VISUAL NARRATIVE PLAN

Every scene receives a visual intention:

| Scene | Visual |
|-------|--------|
| 1 — Hook | Hook Visual |
| 2 — Question | Question Visual |
| 3 — Explanation | Brain Close-up |
| 4 — Memory | Memory Archive |
| 5 — Science | Scientific Diagram |
| 6 — Conclusion | Final Symbolic Shot |

Prompt generation must follow this plan.

---

# 14. WORD EMPHASIS PLANNER ⭐

The AI must decide which words deserve their own visual.

Example: *"Your brain protects you..."* → **Brain** → Word-level Visual

Categories: Concept | Emotion | Object | Action | Symbol

Not every word receives a separate image — only high-impact words.

---

# 15. IMAGE REUSE STRATEGY

Determine per scene:
- New Image
- Reuse Previous Image
- Zoom Existing Image
- Pan Existing Image
- Need Word Visual
- Need Symbolic Insert

Minimizes image generation while maximizing quality.

---

# 16. SYMBOLISM ENGINE

Every important concept receives a symbolic representation:

| Concept | Symbol |
|---------|--------|
| Memory | Archive |
| Fear | Shadow |
| Decision | Crossroads |
| Focus | Spotlight |
| Identity | Mirror |
| Freedom | Open Sky |

The Symbol Library comes from the selected Channel DNA and Project DNA.

---

# 17. VIEWER RETENTION PLAN

Predict attention loss. If attention is likely to drop, automatically recommend:
- Word-level visual
- Camera movement
- New scene
- Question
- Curiosity loop
- Pattern interrupt

---

# 18. NARRATIVE VALIDATION

Before passing to the Script Engine, validate:
- Story Logic
- Curiosity Flow
- Emotional Flow
- Knowledge Progression
- Scene Objectives
- Runtime
- Learning Goal

If validation fails, rebuild the blueprint.

---

# 19. VISUAL SYNCHRONIZATION PLAN ⭐

Generate a synchronization map before any image is rendered.

For each sentence:
- Voice segment
- Estimated speaking duration
- Scene type
- Image type
- Motion suggestion
- Transition suggestion
- Reuse or New Image
- Word-level insert timing

This gives the Timeline Engine a ready-made synchronization map, greatly improving voice-image alignment.

---

# 20. OUTPUT CONTRACT

The Narrative Planner must output structured data:

```json
{
  "story_arc": "Question → Investigation → Reveal",
  "scene_count": 18,
  "emotion_curve": ["Curiosity", "Wonder", "Understanding"],
  "core_question": "Why does the brain fear silence?",
  "learning_goal": "Understand the neuroscience of silence."
}
```

---

# 21. ACCEPTANCE CRITERIA

Complete when:
1. Every project generates a Narrative Blueprint before script writing
2. Every scene has a purpose
3. Curiosity loops are planned automatically
4. Emotional progression is defined
5. Image reuse strategy is decided before prompt generation
6. High-impact words are identified for word-level visuals
7. Blueprint validation passes before the Script Engine starts
8. Visual Synchronization Plan is generated for the Timeline Engine

---

# 22. ARCHITECTURE UPDATE

Replace:

```
Research → Script
```

With:

```
Research → Narrative Planner → Narrative Blueprint → Script Engine → Scene Engine → Prompt Engine
```

The Narrative Blueprint becomes the **master document** that all downstream engines must follow.

---

*End of Volume 02 — Part 04 — Narrative Planner Engine*
