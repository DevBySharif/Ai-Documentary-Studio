# AI Documentary Studio - SRS Volume 02 Part 06 - Prompt Intelligence Engine (PIE)

**Version:** 1.0  
**Status:** Critical  
**Priority:** Highest  

## 1. Objective

Convert Story Structure into a complete visual production plan. Decides what to show, when, whether new image or reuse, which words get visuals, and how continuity is maintained.

## 2. Pipeline Position

Research → Narrative Planner → Story Engine → Prompt Intelligence Engine → Google Flow → Image Library

## 3. Inputs

Channel DNA, Project DNA, Narrative Blueprint, Story Script, Scene Metadata, Emotion Tags, Concept Tags, Visual DNA

## 4. Outputs

Scene Prompt, Word Prompt, Negative Prompt, Prompt Metadata, Image Plan, Image Reuse Plan, Camera Plan, Motion Suggestion, Lighting Plan, Color Plan

## 5. Philosophy

Semantic prompt generation: Meaning → Emotion → Visual Goal → Prompt. Never keyword-based.

## 6. Image Classification

Master Scene, Supporting Scene, Word Visual, Symbolic Visual, Transition Visual.

## 7. Scene Prompts

New locations, concepts, time shifts, characters, events.

## 8. Word Prompts

Detect high-impact words (concept, emotion, scientific, abstract). Each may get dedicated visual.

## 9. Image Reuse Engine

Reuse → Zoom → Pan → Crop → Rotate → Motion → Lighting Shift → Continue. New image only on concept change.

## 10. Semantic Image Grouping

Group by meaning, not line/sentence. Same concept = same image, only motion changes.

## 11. Concept Shift Detector

New image on: character change, environment change, timeline change, significant emotion change, story focus change, primary concept change.

## 12. Character Consistency

Every prompt inherits character, clothing, body shape, expression, art style, pose. No visual drift.

## 13. Art Style Lock

Every prompt inherits Visual DNA, Project DNA, art style, color palette, lighting, camera style.

## 14. Google Flow Optimization

Natural language, clear subject/action/environment, camera/lighting/composition info, style lock, character lock, no unnecessary adjectives.

## 15. Negative Prompts

Wrong anatomy, wrong style, extra characters, blurry, watermark, logo, text, low quality, artifacts, style inconsistency.

## 16. Prompt Validation

Character, environment, camera, lighting, composition, length, quality, consistency.

## 17. Image Library

Store images with: Image ID, Scene ID, Prompt, Concept, Character, Environment, Camera, Emotion, Duration, Reuse Count.

## 18. Prompt Score

Visual Clarity, Consistency, Flow Readiness, Generation Confidence, Reuse Potential, Overall Score.

## 19. Output Contract

```json
{
  "scene": 12,
  "image_type": "Scene",
  "prompt": "...",
  "negative_prompt": "...",
  "reuse": false,
  "camera": "Medium Close-up",
  "motion": "Slow Push-in",
  "estimated_duration": 5.2
}
```

## 20. Image Plan

Pre-plan which scenes get new images, which reuse, which get word visuals.

## 21. Zenn-style Visual Rhythm

Reuse when meaning same. New on concept change. Word-level for high-impact only. Alternate wide/symbolic/close-up. Avoid rapid changes. Calm documentary rhythm.

## 22. Visual Storyboard Engine

Intermediate stage before prompts: shot list with number, purpose, image type, camera angle, visual metaphor, reuse/new, duration. Approved storyboard → final prompts.
