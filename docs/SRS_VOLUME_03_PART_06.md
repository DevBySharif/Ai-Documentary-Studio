# Subtitle Rendering Engine — Volume 03 Part 06

## Overview
A comprehensive subtitle rendering pipeline supporting word-level highlighting, phrase grouping, AI-driven line breaks, reading speed analysis, smart positioning, safe-area enforcement, font system, multi-language and RTL support, adaptive keyword emphasis, animations, multiple export formats, accessibility, an AI subtitle director, visual collision detection, quality analysis, and validation.

## Modules

| Module | File | Description |
|--------|------|-------------|
| Types | `types.ts` | Core type definitions (SRSubtitleType, SRPosition, SRAnimationStyle, SREmphasisStyle, SRExportFormat, SRWord, SRPhrase, SRSentence, SRSubtitleLine, SRReadingSpeedResult, SRSafeZone, SRKeywordEmphasis, SRCollisionEvent, SRQualityScore, SRAISubtitleDecision) |
| Word Highlight | `word-highlight.ts` | Word-level confidence-based highlighting engine |
| Phrase Grouping | `phrase-grouping.ts` | Groups words into phrases based on pauses and punctuation |
| AI Line Break | `line-break.ts` | AI-driven line break engine (natural, compact, expanded modes) |
| Reading Speed | `reading-speed.ts` | Analyzes and adjusts subtitle duration for comfortable reading |
| Smart Positioning | `smart-positioning.ts` | Determines subtitle position based on face boxes and scene brightness |
| Safe Area | `safe-area.ts` | Enforces safe-area boundaries (mobile, TV presets) |
| Font System | `font-system.ts` | Font configuration and language-specific fallback fonts |
| Multi-Language | `multi-lang.ts` | Language direction detection, text alignment, font fallbacks |
| RTL | `rtl.ts` | RTL character detection, reordering, bidirectional text handling |
| Keyword Emphasis | `keyword-emphasis.ts` | Emotion-based keyword emphasis with registerable handlers |
| Adaptive Emphasis | `adaptive-emphasis.ts` | Context-aware adaptive keyword emphasis |
| Animations | `animations.ts` | Subtitle animation transforms (fade, pop, slide, typewriter, word_reveal, scale) |
| Export | `export.ts` | Multi-format export (burn_in, SRT, ASS, VTT, JSON timeline) |
| Accessibility | `accessibility.ts` | High-contrast mode, font scaling, speaker labels, sound descriptions |
| AI Director | `ai-director.ts` | AI-driven subtitle decisions (position, timing, animation, line breaks) |
| Collision Detector | `collision-detector.ts` | Detects and resolves subtitle collisions with faces, subjects, UI elements |
| Quality Analyzer | `quality-analyzer.ts` | Multi-metric quality scoring (sync, reading comfort, line breaks, highlights) |
| Validation | `validation.ts` | Validates word alignment, timing, reading speed, safe area, visibility, fonts |
| Manager | `manager.ts` | `SRSubtitleRenderingEngine` — top-level orchestrator composing all subsystems |

## Key Design Decisions
- All modules are composable via `SRSubtitleRenderingEngine` in `manager.ts`
- AI director makes context-aware decisions based on emotion, camera movement, and scene brightness
- Multiple export formats supported for different post-production workflows
- Full RTL/bidirectional text support for Arabic, Hebrew, Urdu, Persian
- Quality analyzer provides actionable feedback (overall score, pass/fail)
- Accessibility features are opt-in via `SRAccessibilityEngine`
