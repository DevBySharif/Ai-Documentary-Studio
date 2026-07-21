# AI Documentary Studio - SRS Volume 02.5 Part 03 - Image Decision Engine

**Version:** 1.0 **Status:** Critical **Priority:** Highest

## Objective
Determine optimal visual strategy for every semantic segment. Minimize image generation while maximizing storytelling. Always prefer semantic continuity over visual novelty.

## Position
Semantic Segmentation Engine → Image Decision Engine → Memory Manager → Prompt Engine → Timeline Engine

## Available Strategies (evaluated in order)
Reuse → Motion Only → Word Insert → Symbol Insert → Split Scene → Merge Scene → Hold Current Scene → Generate New Image

## Reuse Detector
Check: same concept, emotion, environment, character, visual goal. If similarity exceeds threshold, reuse.

## Reuse Score
Concept Similarity + Emotion Similarity + Camera Match + Composition Match + Visual Intent Match + Story Continuity.

## Image Age Rule
Store reuse count, screen time, viewer exposure. Long exposure reduces reuse priority.

## Motion-Only Decision
If concept + emotion unchanged and visual already strong: do NOT generate image. Use zoom/pan/push/hold/parallax instead.

## Word Insert Decision
Allowed only if: Important Concept AND High Voice Emphasis AND High Story Importance.

## Symbol Insert Decision
Use symbols: freedom→bird, hope→sunrise, identity→mirror, memory→old photograph.

## Image Split Decision
Split only if two independent visual ideas exist in one segment.

## Image Merge Decision
Merge when concept, emotion, environment, purpose remain unchanged.

## Image Density Limit
Maximum 1 image every 4-8 seconds unless story requires otherwise.

## Visual Importance Score
Critical / High / Medium / Low. Critical visuals remain longer, receive stronger motion, smoother transitions.

## Symbol Consistency
If mirror represented identity once, reuse same symbol later.

## Image Cost Optimizer
Compare generation vs reuse vs time vs memory cost. Choose lowest-cost strategy preserving quality.

## Zenn-style Profile
Explain same idea with same image. Prefer camera movement over image replacement. New visuals only when new mental model needed. Highlight only most important words. No visual hyperactivity.

## Visual Decision Tree
Meaning Changed? → NO → Emotion Changed? → NO → Hold/Motion Only / YES → Adjust Motion
Meaning Changed? → YES → Existing Image Matches? → YES → Reuse / NO → Symbol Available? → YES → Symbol Insert / NO → Generate New Image

## Image Opportunity Engine (Secret Sauce)
Instead of "Do I need a new image?": Can this concept be explained with current image? Can camera move create new scene feeling? Can cropping reveal new info? Can word insert communicate better? Can combining two existing images avoid generating a third?
Opportunity Score: 90-100 Keep, 70-89 Reuse+Motion, 50-69 Reuse+Insert, <50 Generate.
