# AI Documentary Studio
## Software Requirement Specification
## Volume 02 — Part 02 — Channel DNA System

**Version:** 1.0
**Status:** Approved
**Priority:** Critical

---

# 1. OBJECTIVE

The application must never be hardcoded for any specific YouTube channel. Instead, every channel must be represented by a reusable **Channel DNA**. A Channel DNA is the complete identity of a YouTube channel. Changing the Channel DNA changes how the AI thinks.

---

# 2. WHAT IS CHANNEL DNA

Channel DNA is a structured knowledge package containing everything that defines a channel — not just prompts, not just writing style. Everything.

```
Channel → Identity → Knowledge → Visual Language → Storytelling
         → Prompt Rules → Editing Rules → Thumbnail Rules → SEO Rules
```

---

# 3. DESIGN PRINCIPLE

The AI never asks *"How should I write?"* Instead it asks *"Which DNA am I using?"* Everything comes from the selected DNA.

---

# 4. CHANNEL DNA STRUCTURE

Every DNA contains:
- General
- Story DNA
- Visual DNA
- Prompt DNA
- Editing DNA
- Research DNA
- Audio DNA
- Thumbnail DNA
- SEO DNA
- Quality Rules
- Knowledge Base
- Visual Library
- Prompt Library
- Motion Library

---

# 5. GENERAL INFORMATION

| Field | Description |
|-------|-------------|
| Channel Name | Display name |
| Description | Short description |
| Category | Psychology, History, Finance, etc. |
| Language | Content language |
| Target Audience | Demographic |
| Average Video Length | In seconds |
| Upload Frequency | videos per week |
| Writing Difficulty | conversational / moderate / academic |
| Default Runtime | Default video length in seconds |

---

# 6. STORY DNA

| Component | Description |
|-----------|-------------|
| Story Formula | Three-act, mystery box, etc. |
| Hook Formula | Curiosity gap, question, stat, etc. |
| CTA Formula | Subscribe, comment, curiosity, etc. |
| Curiosity Rules | Open loop frequency, types |
| Reveal Rules | Timing, layering of reveals |
| Open Loop Rules | Max open loops, resolution strategy |
| Pacing Rules | Scene length, sentence length |
| Emotion Curve | Emotional journey template |
| Sentence Length | Average words per sentence |
| Paragraph Style | Short paragraphs, single sentences |
| Information Density | concepts per minute |
| Question Style | Rhetorical, direct, pattern-interrupt |
| Scientific Style | Analogy-first, simplified definitions |

---

# 7. VISUAL DNA

| Component | Description |
|-----------|-------------|
| Art Style | Flat vector, 3D, photorealistic, etc. |
| Character Style | Stick figure, detailed, abstract |
| Environment Style | Minimal, detailed, abstract |
| Background Style | Gradient, solid, blurred, pattern |
| Object Style | Flat, outlined, realistic |
| Camera Language | Eye-level, low-angle, wide, close-up |
| Composition | Rule of thirds, center, symmetry |
| Lighting | Soft diffuse, dramatic, mood |
| Color Palette | Primary, accent, background, mood |
| Outline Thickness | Thin, medium, thick, none |
| Negative Space | Generous, balanced, minimal |
| Perspective | 2D flat, isometric, 3D, orthographic |
| Visual Symbolism | Metaphor library, concept mapping |

---

# 8. PROMPT DNA

Prompt DNA stores **generation rules**, never fixed prompts.

| Component | Description |
|-----------|-------------|
| Character Lock | Force character consistency across scenes |
| Style Lock | Force art style consistency |
| Camera Rules | Default camera for each scene type |
| Lighting Rules | Default lighting per emotion |
| Composition Rules | Framing rules per scene purpose |
| Prompt Prefix | Universal prefix for every prompt |
| Prompt Suffix | Universal quality suffix |
| Negative Prompt | Universal negative prompt rules |
| Consistency Rules | Character, environment, style enforcement |
| Image Reuse Rules | When to reuse vs generate new |
| Word Prompt Rules | Rules for text/word-level visuals |
| Scene Prompt Rules | Per-purpose prompt optimization |

---

# 9. EDITING DNA

| Component | Description |
|-----------|-------------|
| Camera Motion | Zoom, pan, push, pull, parallax |
| Zoom Rules | Speed, direction, emotion mapping |
| Pan Rules | Direction, speed limits |
| Push Rules | Intensity, timing |
| Pull Rules | Slow reveal, context |
| Parallax | Depth layers, speed ratio |
| Hold Duration | Minimum/maximum hold per image type |
| Transition Style | Crossfade, dissolve, cut, fade |
| Scene Rhythm | Build-up, climax, resolution |
| Viewer Retention Style | Pacing to maintain attention |
| Emotion Mapping | Motion → emotion lookup table |

---

# 10. RESEARCH DNA

| Component | Description |
|-----------|-------------|
| Preferred Sources | Wikipedia, papers, expert articles |
| Fact Checking | Verification level, sources required |
| Scientific Accuracy | Accessible vs rigorous |
| Analogy Style | Everyday, technical, creative |
| Simplification Rules | Max technical depth |
| Citation Rules | Style, visibility |
| Explanation Style | Conversational, academic, narrative |

---

# 11. AUDIO DNA

| Component | Description |
|-----------|-------------|
| Preferred Voice | Provider + voice ID |
| Speech Speed | Words per minute |
| Speech Emotion | Per-section emotional tone mapping |
| Pause Rules | Duration per punctuation/emotion |
| Subtitle Rules | Style, position, animation |
| Narration Style | Warm, authoritative, excited, calm |

---

# 12. THUMBNAIL DNA

| Component | Description |
|-----------|-------------|
| Thumbnail Formula | Curiosity gap, face close-up, text |
| Color | High contrast, palette rules |
| Composition | Face left, text right, center |
| Text Placement | Position, max words, font |
| Object Size | Oversized, scaled, realistic |
| Emotion | Surprise, curiosity, fear, wonder |
| Contrast | Foreground/background rules |
| Click Trigger | Curiosity gap, pattern interrupt |

---

# 13. SEO DNA

| Component | Description |
|-----------|-------------|
| Title Formula | Question, list, curiosity, stat |
| Description Formula | Hook → summary → bullet → CTA |
| Keyword Formula | Primary + secondary + long-tail |
| Hashtags | Count, style, placement |
| Playlist Strategy | Series detection, ordering |
| Tags | Broad → niche → specific |

---

# 14. KNOWLEDGE BASE

Every Channel DNA contains its own isolated Knowledge Base:

| Channel Type | Knowledge Domains |
|-------------|-------------------|
| Psychology | Brain, memory, habits, dopamine, identity |
| History | Timeline, wars, kings, maps, artifacts |
| Finance | Money, stocks, economy, investment |
| Space | Cosmos, planets, physics, astronomy |

Knowledge must remain isolated between channels.

---

# 15. VISUAL LIBRARY

Every DNA contains:

| Library | Contents |
|---------|----------|
| Character Library | Reusable character definitions |
| Object Library | Reusable props and objects |
| Background Library | Reusable background styles |
| Environment Library | Reusable scene environments |
| Symbol Library | Concept → visual symbol mappings |
| Camera Library | Reusable camera setups |

The AI must reuse these libraries to maintain visual consistency.

---

# 16. PROMPT LIBRARY

Store reusable prompt templates organized by category:

`Hook | Brain | Memory | Scientist | History | Space | Finance | City | Office | Close-up | Wide Shot | Macro`

The Prompt Engine combines templates dynamically rather than using fixed prompts.

---

# 17. MOTION LIBRARY

Every DNA stores preferred motion patterns mapped to narrative functions:

| Narrative Function | Preferred Motion |
|-------------------|-----------------|
| Thinking | Slow Zoom |
| Research | Camera Push |
| Reveal | Light Sweep |
| Memory | Floating Particle |
| Danger | Camera Shake |
| Discovery | Dolly In |
| Conclusion | Slow Pull Out |

---

# 18. QUALITY RULES

Every DNA defines minimum quality standards:

| Check | Minimum Threshold |
|-------|------------------|
| Character Consistency | 95% |
| Art Style Consistency | 95% |
| Prompt Quality | 90% |
| Story Flow | 95% |
| Timeline Accuracy | 98% |

If quality falls below threshold, the AI must regenerate before proceeding.

---

# 19. DNA MANAGER

Users can perform the following operations:

| Operation | Description |
|-----------|-------------|
| Create DNA | Build new from scratch or template |
| Duplicate DNA | Clone an existing profile |
| Rename DNA | Change display name |
| Delete DNA | Remove permanently |
| Export DNA | Download as JSON / YAML / Markdown |
| Import DNA | Upload a DNA file |
| Version DNA | Track changes with version history |
| Archive DNA | Soft-delete, restore later |
| Set Default DNA | Assign default for new projects |

---

# 20. DNA VERSION CONTROL

Every edit creates:

| Field | Description |
|-------|-------------|
| Version Number | Semantic version (1.0.0) |
| Created Date | Original creation timestamp |
| Modified Date | Last edit timestamp |
| Change Log | Description of what changed |
| Rollback Point | Previous version for recovery |

No destructive edits — every change is versioned.

---

# 21. DNA IMPORT / EXPORT

Supported formats:
- JSON
- YAML
- Markdown

Future support:
- Cloud Marketplace

---

# 22. DNA VALIDATION

Before saving, the system validates:

| Check | Description |
|-------|-------------|
| Missing Rules | Required fields check |
| Contradicting Rules | Conflicting instructions |
| Invalid Values | Out-of-range or incorrect types |
| Incomplete Sections | Partial configurations |
| Unused Libraries | Orphaned references |
| Broken References | Missing inheritance targets |

---

# 23. BUILT-IN DNA PROFILES

The application ships with starter profiles only:

- Mind Documentary
- History Documentary
- Science Documentary
- Finance Documentary
- Business Documentary
- Education Documentary

Users may edit, extend, or replace them freely.

---

# 24. CHANNEL DNA INHERITANCE

The system supports DNA inheritance:

```
Mind Documentary DNA
  ├── Mind Documentary v2
  ├── Mind Documentary Shorts
  └── Mind Documentary Premium
```

**Child DNA** inherits all parent rules. Users override only selected sections.

Example:
- Parent: Art Style = Stick Figure
- Child: Only Editing DNA changed → More Dynamic Motion
- Everything else remains inherited.

This prevents duplicate work.

---

# 25. DNA MARKETPLACE (Future)

Users should be able to:
- Sell DNA
- Share DNA
- Import DNA
- Rate DNA
- Clone DNA
- Follow Creators

This architecture must already be supported in the data model.

---

# 26. DNA COMPILER

The DNA Compiler sits between raw DNA storage and the AI Brain:

```
Channel DNA → Validate → Compile → Optimize → Cache → AI Brain Ready
```

Its responsibilities:

| Step | Description |
|------|-------------|
| Validate | Check all rules for completeness and consistency |
| Resolve Conflicts | Detect and fix contradicting instructions |
| Build Runtime Config | Generate fast-access configuration |
| Cache Templates | Pre-compile frequently used prompt/visual templates |
| Prepare Engines | Generate optimized config for Story, Prompt, Editing Engines |

This ensures the app performs well even with a large DNA library.

---

# 27. ARCHITECTURE UPDATE

Replace:

```
AI Director → Story Engine
```

With:

```
AI Director → Channel DNA → Project DNA → Story Engine
```

The AI Director must always load the selected Channel DNA before executing any engine. No engine is allowed to operate without an active DNA profile.

---

*End of Volume 02 — Part 02 — Channel DNA System*
