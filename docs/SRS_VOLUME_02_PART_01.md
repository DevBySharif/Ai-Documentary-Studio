# AI Documentary Studio
## Software Requirement Specification
## Volume 02 — Part 01 — AI Director Core Architecture

**Version:** 1.0
**Status:** Approved
**Priority:** Critical

---

# 1. PURPOSE

The **AI Director Core** is the central intelligence system of the entire application.

Every decision made inside the application must pass through the AI Director Core.

The AI Director does not simply generate scripts or prompts.

It behaves like a professional documentary production team.

It understands:
- storytelling
- psychology
- cinematography
- prompt engineering
- editing
- synchronization
- pacing
- audience retention

...before making any decision.

---

# 2. DESIGN PHILOSOPHY

Traditional AI tools work like this:

```
Prompt → Result
```

**AI Documentary Studio must never work this way.**

Instead:

```
Idea → Research → Understanding → Planning → Decision → Execution
```

The AI must understand the project before generating anything.

---

# 3. AI DIRECTOR CORE

The AI Director is **not a single AI model**.

It is an **orchestration layer**.

It coordinates multiple specialized intelligence modules.

```
User
  │
  ▼
AI Director Core
  │
  ├── Research
  ├── Narrative
  ├── Script
  ├── Scene
  ├── Prompt
  ├── Editing
  ├── Timeline
  └── Quality
```

---

# 4. CORE RESPONSIBILITIES

The AI Director is responsible for:

| Responsibility | Description |
|----------------|-------------|
| Understanding Goal | Interpret the user's idea and intent |
| Selecting Channel DNA | Choose the correct channel identity |
| Creating Project DNA | Build per-video personality from idea + DNA |
| Planning the Story | Generate narrative blueprint before writing |
| Supervising Engines | Coordinate every AI engine in sequence |
| Validating Outputs | Check every output before passing it forward |
| Ensuring Consistency | Verify story, character, style across modules |
| Improving Retention | Apply curiosity loops and pacing rules |
| Approving Render | Final quality gate before video export |

**No module is allowed to bypass the AI Director.**

---

# 5. MODULAR ARCHITECTURE

Every intelligence engine is independent.

Modules include:

| Engine | Function |
|--------|----------|
| Research Engine | Gather and verify information |
| Narrative Planner | Design story arc, emotion, reveals |
| Story Engine | Define story structure rules |
| Script Engine | Write the full documentary script |
| Scene Engine | Analyze and segment scenes |
| Prompt Engine | Generate image prompts per scene |
| Visual Engine | Plan visual language and metaphors |
| Editing Engine | Define motion, transitions, rhythm |
| Timeline Engine | Synchronize visuals with voice |
| Motion Engine | Apply camera movement to images |
| Quality Engine | Validate all outputs |

Every module communicates through **structured data**. Never through plain text only.

---

# 6. AI ORCHESTRATION FLOW

```
User Idea
  │
  ▼
AI Director
  │
  ▼
Research Engine
  │
  ▼
Narrative Planner
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
Image Upload Analysis
  │
  ▼
Voice Analysis
  │
  ▼
Timeline Engine
  │
  ▼
Motion Engine
  │
  ▼
Quality Engine
  │
  ▼
Renderer
```

The Director validates each step before continuing.

---

# 7. DECISION PIPELINE

The Director never guesses.

Each decision follows:

```
Collect Data
    ↓
Analyze
    ↓
Compare with DNA
    ↓
Generate Options
    ↓
Choose Best Option
    ↓
Validate
    ↓
Store
```

This prevents inconsistent outputs.

---

# 8. UNIVERSAL MODEL SUPPORT

The AI Director must not depend on a single LLM.

Supported providers should be interchangeable:

- OpenAI
- Google Gemini
- Anthropic Claude
- Future Providers

Changing providers must not require changing the business logic.

---

# 9. DATA CONTRACTS

Every engine must return structured JSON.

```json
{
  "scene_id": 12,
  "purpose": "Introduce memory concept",
  "emotion": "Curiosity",
  "importance": "High",
  "need_new_image": true,
  "need_word_visual": false,
  "estimated_duration": 5.8
}
```

Plain-text communication between engines is **not allowed**.

---

# 10. AI DECISION MEMORY

The Director maintains temporary project memory.

It stores:

| Memory Type | Contents |
|-------------|----------|
| Story Progress | Current position in narrative arc |
| Open Questions | Unresolved curiosity loops |
| Characters | Active characters and their traits |
| Visual Identity | Art style, color palette, metaphors |
| Scene History | All generated scenes |
| Prompt History | All generated prompts |
| Motion History | All motion decisions |

Memory is **isolated per project**.

No project may leak information into another.

---

# 11. CONSISTENCY RULES

The Director must continuously verify:

| Consistency Type | What it checks |
|-----------------|----------------|
| Story Consistency | Does the narrative flow logically? |
| Character Consistency | Are characters visually/narratively stable? |
| Art Style Consistency | Does the visual style remain uniform? |
| Prompt Consistency | Do prompts follow DNA rules? |
| Editing Consistency | Is the editing style coherent? |
| Voice Consistency | Does voice match the video's emotional tone? |
| Scene Consistency | Are scene transitions smooth? |
| Timeline Consistency | Do visuals sync with audio? |

If inconsistency is detected, **regeneration is required** before moving forward.

---

# 12. FAILURE RECOVERY

If any module fails:

```
Detect Failure → Identify Source → Retry → Fallback Strategy → Notify User → Continue if Safe
```

The application must **never crash** because one engine failed.

---

# 13. AI PRIORITY ORDER

When conflicts occur, prioritize:

| Priority | Concern |
|----------|---------|
| 1 (Highest) | Story Quality |
| 2 | Viewer Understanding |
| 3 | Visual Consistency |
| 4 | Synchronization |
| 5 | Editing Quality |
| 6 (Lowest) | Rendering Speed |

Fast output must **never** reduce story quality.

---

# 14. PROJECT EXECUTION STATE

Each project moves through defined states:

```
Created
  ↓
Researching
  ↓
Planning
  ↓
Writing
  ↓
Scene Planning
  ↓
Prompt Planning
  ↓
Waiting for Images
  ↓
Image Analysis
  ↓
Voice Processing
  ↓
Timeline Generation
  ↓
Motion Planning
  ↓
Quality Review
  ↓
Rendering
  ↓
Completed
```

Users should always see the current state.

---

# 15. ENGINE COMMUNICATION RULES

Every engine must:

- Accept structured input
- Validate required fields
- Return structured output
- Report confidence score
- Report warnings
- Report errors

No hidden assumptions are allowed.

---

# 16. AI CONFIDENCE SCORE

Each engine returns:

```json
{
  "confidence": 0.94,
  "warnings": [],
  "errors": []
}
```

The Director uses confidence scores to decide whether to continue automatically or request review.

---

# 17. SECURITY & PRIVACY

The AI Director must:

- Never mix user projects
- Never expose one user's DNA to another
- Keep uploaded assets isolated
- Avoid using project data outside the active workspace unless the user explicitly exports it

---

# 18. ACCEPTANCE CRITERIA

The AI Director Core is considered complete when it can:

1. Accept an idea
2. Select the appropriate Channel DNA
3. Create a Project DNA
4. Coordinate all AI engines in order
5. Detect and recover from failures
6. Maintain project consistency
7. Produce structured outputs ready for the Video Engine

---

# 19. FUTURE EXTENSIBILITY

The architecture must allow adding new engines without changing existing ones.

Examples of future engines:

- Thumbnail Engine
- Music Engine
- Subtitle Engine
- Shorts Engine
- Translation Engine
- Analytics Engine

These should plug into the AI Director through the same structured interface.

---

# 20. IMPLEMENTATION NOTES

- Use a **plugin-based architecture** so each engine can be developed and replaced independently
- Use **event-driven communication** between modules instead of tightly coupling them
- Keep **AI provider logic separate from business logic** using an adapter pattern
- **Log every major AI decision** for debugging and future optimization
- Design all workflows to be **asynchronous** where possible, since research, transcription, and rendering may take significantly different amounts of time

---

*End of Volume 02 — Part 01 — AI Director Core Architecture*
