# VOLUME 02.6 — PART 03: VISUAL SIMILARITY ENGINE

**Version:** 1.0
**Status:** Critical
**Priority:** Highest

## 1. OBJECTIVE

The Visual Similarity Engine determines how visually and semantically similar two or more images are. Its purpose is to maximize intelligent image reuse while preserving storytelling quality. The engine compares meaning, style, composition, and visual identity—not just pixels.

## 2. MULTI-DIMENSION SIMILARITY

Similarity is calculated from eight dimensions: Semantic, Visual, Style, Composition, Emotion, Character, Object, Color. Each contributes to the final score.

## 3. EMBEDDING ENGINE

Every image has a vector representation. Workflow: Image → Embedding → Vector Database → Nearest Neighbor Search.

## 4. SEMANTIC SIMILARITY

Different images with the same semantic meaning score high similarity (e.g., "Old Man Reading" ≈ "Elderly Person Studying").

## 5. STYLE & CHARACTER SIMILARITY

Style comparison: Art style, Line thickness, Brush pattern, Contrast, Shadow style, Rendering technique. Character comparison: Face, Stick shape, Clothing, Accessories, Pose, Silhouette, Identity.

## 6. PERCEPTUAL HASHING

Fast duplicate detection using: Perceptual Hash, Difference Hash, Average Hash.

## 7. SIMILARITY SCORE

Example weights: Semantic 40%, Style 20%, Composition 15%, Emotion 10%, Objects 10%, Color 5%.

## 8. REUSE THRESHOLDS

- 95-100: Identical → Reuse Immediately
- 90-94: Very High → Reuse
- 80-89: High → Suggest Reuse
- 65-79: Medium → Manual AI Review
- Below 65: Generate New Image

## 9. HYBRID SIMILARITY AI

Combine multiple models: Embedding Score + Perceptual Hash + Object Detection + Visual DNA + Prompt Similarity → Hybrid Score. Reduces false positives.

## 10. CONTEXT-AWARE REUSE ENGINE

Before recommending reuse, evaluate: Was this image shown recently? Will repetition cause fatigue? Does narration add new meaning? Would camera motion create novelty?
