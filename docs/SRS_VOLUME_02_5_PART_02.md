# AI Documentary Studio - SRS Volume 02.5 Part 02 - Semantic Segmentation Engine

**Version:** 1.0 **Status:** Critical **Priority:** Highest

## Objective
Divide narration into meaningful visual units — never by lines/sentences/commas/duration. Identify changes in meaning, concepts, emotions, visual intent.

## Position
Story Engine → Audio Intelligence → Whisper → Semantic Audio Map → Semantic Segmentation Engine → Image Decision Engine

## Segment Types
Introduction, Explanation, Example, Metaphor, Question, Reveal, Emotion, Transition, Ending

## Concept Detector
Primary Concept, Secondary Concept, Supporting Concepts. Only Primary Concept controls image decisions.

## Concept Shift Detector
Generate new segment only when primary concept changes.

## Semantic Continuity Score
0.00 (different) → 1.00 (identical meaning). Score above threshold = reuse image.

## Emotion Shift Detector
Monitor curiosity, fear, wonder, reflection, surprise, hope, urgency. Emotion change may adjust motion without image change.

## Visual Complexity Score
Simple / Medium / Complex / Highly Abstract — determines existing image, symbolic, or new scene.

## Importance Score
Story importance + viewer attention + emotional impact + concept novelty + narrative turning point.

## Word Cluster Detector
Group related words into concept clusters. Avoid unnecessary word inserts.

## Metaphor Detector
Detect symbolic narration. Use symbolic visuals instead of literal.

## Question Detector
Questions need different pacing — hold image, slow push, delay transition.

## Reveal Detector
Prepare new image, strong transition, focused motion.

## Semantic Boundary Detector
Not every sentence boundary is a visual boundary. Only create boundary when meaning changes.

## Segment Merging
Same concept + same emotion + same visual goal = merge.

## Segment Splitting
Split only on major concept shift, important keyword, emotional peak, story reveal, new environment.

## Zenn-style Profile
Never change images because a sentence ends. Continue same visual while same idea develops. New visual only when audience needs different mental model.

## Visual Intent Detector
Before image decisions: Determine why visual exists (Explain, Illustrate, Emphasize, Symbolize, Reveal, Question, Compare, Recall, Transition).
