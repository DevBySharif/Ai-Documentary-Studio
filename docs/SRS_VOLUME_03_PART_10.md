# Quality Assurance AI — Volume 03 Part 10

## Overview
Complete technical and artistic inspection of the rendered production before export. Ensures every documentary meets required production standards without manual review.

## Modules

| Module | File | Description |
|--------|------|-------------|
| Types | `types.ts` | Core type definitions (visual/audio/subtitle/motion/effect/style metrics, artifact types, issue severity, reports, fixes, flags, scores, certificates, zenn profile) |
| Visual Quality Analyzer | `visual-quality-analyzer.ts` | 7-dimension visual inspection (sharpness, frame stability, color consistency, lighting, artifacts, noise, compression) |
| Audio Quality Analyzer | `audio-quality-analyzer.ts` | 7-dimension audio inspection (narration clarity, music balance, noise, clipping, LUFS, stereo compatibility, dynamic range) |
| Subtitle QA | `subtitle-qa.ts` | 6-dimension subtitle verification (word timing, sentence timing, reading speed, safe area, font consistency, highlight accuracy) |
| Motion QA | `motion-qa.ts` | 5-dimension motion inspection (camera smoothness, speed, parallax stability, zoom quality, continuity) |
| Effect QA | `effect-qa.ts` | 6-dimension effect validation (bloom, grain, blur, fog, glow, transitions) with subtlety enforcement |
| Style Consistency | `style-consistency.ts` | 6-dimension scene-vs-Channel-DNA comparison (color, motion, subtitle, camera, lighting, visual identity) |
| Sync Validation | `sync-validation.ts` | 4-dimension sync accuracy (voice→subtitle, subtitle→motion, motion→scene, scene→transition) |
| Artifact Detector | `artifact-detector.ts` | 7-type artifact detection (compression, ghosting, flicker, banding, aliasing, dropped frames, duplicate frames) |
| Timeline Validation | `timeline-validation.ts` | 5-dimension timeline integrity (missing scenes, empty timelines, subtitle gaps, audio gaps, broken transitions) |
| Accessibility QA | `accessibility-qa.ts` | 5-dimension accessibility (subtitle contrast, font size, reading speed, color accessibility, mobile visibility) |
| Export Validation | `export-validation.ts` | 7-point export integrity (codec, resolution, frame rate, bitrate, audio codec, metadata, container) |
| AI Quality Score | `ai-quality-score.ts` | Weighted 5-dimension overall score (visual, audio, subtitle, motion, consistency) with letter grade |
| Auto Fix Engine | `auto-fix-engine.ts` | Automatic correction of safe issues (low-risk only: subtitle timing, music level, color shift, transition speed) |
| Manual Review Flags | `manual-review-flags.ts` | Flags critical issues requiring human attention (missing narration, incorrect image, subtitle mismatch, sync error, corrupted asset, failed render) |
| Zenn QA Profile | `zenn-qa-profile.ts` | Default documentary quality rules (cinematic pacing, consistent grading, smooth motion, high readability, clean narration) |
| AI Style Guardian | `ai-style-guardian.ts` | Monitors entire production for Channel DNA compliance (art style, character, color palette, camera/motion language, typography) |
| Story Flow Analyzer | `story-flow-analyzer.ts` | Narrative continuity analysis (scene transitions, emotional pacing, information density, visual rhythm, pause placement, viewer attention) |
| Production Certification | `production-certification.ts` | Generates final production certificate (production ID, render profile, DNA version, QA score, render date, export format, approval) |
| Validator | `validator.ts` | 6-point pre-approval validation (visual, audio, subtitle, motion, timeline, export integrity) |
| Output Contract | `output-contract.ts` | Final QA contract (overall score, status, warnings, critical, auto-fixed) |
| QA Engine | `quality-assurance.ts` | `QAQualityAssuranceEngine` — top-level orchestrator composing all 21 sub-engines |

## Key Design Decisions
- All 22 modules composable via `QAQualityAssuranceEngine`
- Auto Fix Engine only applies low-risk corrections automatically; all critical issues block export
- Style Guardian enforces Channel DNA compliance across every scene
- Story Flow Analyzer recommends adjustments for rushed/repetitive/uneven documentaries
- Certification system ensures only qualified productions are marked Ready for Publishing
