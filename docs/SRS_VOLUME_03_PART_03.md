# AI Documentary Studio — SRS Volume 03 Part 03: Scene Renderer

**Version:** 1.0  
**Status:** Implemented

## 1. Objective
Transform approved visual assets into cinematic documentary scenes through layer-based composition, camera movement, effects, subtitles, and overlays.

## 2. Modules

### 2.1 Layer-Based Renderer
8 independent layers (background, depth, main_subject, foreground, effects, subtitles, word_highlights, debug) rendered independently by z-index.

### 2.2 Scene Compositor
Assembles image + motion + camera + blur + glow + subtitle + overlay into a render-ready scene composition.

### 2.3 Safe Area Manager
Reserves space for subtitles, logo, watermark, word inserts, and mobile cropping. Detects zone violations (warning/critical).

### 2.4 Auto Framing Engine
Automatically frames character/object/symbol/keyword by confidence. Tracks subjects with smooth interpolation between frames.

### 2.5 Rule of Thirds Engine
Evaluates composition against 4 intersection points. Scores composition quality and suggests position adjustments.

### 2.6 Subject Tracker
Tracks main character/object/symbol. Provides real-time position updates for camera targeting during motion.

### 2.7 Auto Crop Engine
Intelligent cropping for 16:9, 9:16, 1:1, 4:5. Respects subject bounding boxes to never crop faces, hands, symbols, or subtitles.

### 2.8 Depth Map Engine
Estimates 5 depth layers (foreground, character, objects, environment, sky). Extracts foreground/background for parallax.

### 2.9 Scene Parallax Compositor
Each depth layer moves independently with configurable parallax speed. Supports Ken Burns effect integration.

### 2.10 Scene Lighting Engine
Configurable vignette, directional light, glow, ambient light, and fog with per-pixel vignette calculation.

### 2.11 Scene Focus Engine
Maintains viewer attention with priority chain: face → symbol → object → background. Determines when to soften background.

### 2.12 Visual Safety Engine
Detects subject cropping, subtitle collision, camera drift, aspect distortion, over-zoom (>2x), and blur artifacts.

### 2.13 Frame Compositor
Composes final frame from sorted layers + camera transform into a unified render package.

### 2.14 Cinematic Composition AI
Evaluates rule of thirds, visual balance, leading lines, negative space, camera weight, and motion direction. Produces an overall composition score with improvement suggestions.

### 2.15 Multi-Layer Depth Engine
Intelligent 5-layer depth extraction with independent camera motion per layer for subtle 2.5D documentary movement.

### 2.16 Smart Scene Stabilizer
Monitors for excessive zoom, abrupt framing, camera jitter, composition drift, and unsafe cropping in real-time.

### 2.17 Adaptive Render Profiles
Channel-aware profiles: Documentary (calm/soft/minimal), Educational (clear/neutral/moderate), Storytelling (dramatic/dramatic/strong), Shorts (tight/dramatic/moderate). Each profile configures lighting, safe area, and effects automatically.

### 2.18 Scene Validator
6 checks: subject visible, safe area, subtitle visibility, motion compatibility, resolution, layer integrity.

### 2.19 SceneRenderer Manager
Orchestrates all sub-engines. Single `renderScene()` call processes image + targets + camera + profile into a complete scene composition.
