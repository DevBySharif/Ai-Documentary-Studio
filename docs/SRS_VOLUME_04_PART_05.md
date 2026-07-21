# SRS Volume 04 Part 05 — Image Provider Manager

## Overview
The Image Provider Manager manages all image generation providers through a unified abstraction layer. It handles provider selection, prompt adaptation, style consistency, seed management, image validation, retries, caching, and quality optimization.

## Supported Providers
Google Flow, Google Imagen, FLUX, Stable Diffusion, ComfyUI, Fal.ai, Replicate, plus future: Midjourney, Black Forest Labs, Ideogram, Reve, OpenAI Image, local engines.

## Sub-Modules

### Provider Abstraction
Unified interface for all providers with generate/isAvailable/getName. Built-in adapters: Google Flow, Google Imagen, FLUX, Stable Diffusion, ComfyUI, Fal.ai, Replicate. Provider registry.

### Prompt Adaptation Engine
Adapts master prompts per provider (FLUX, SDXL, etc.) while keeping the master prompt unchanged. Provider-specific prompt formatting.

### Style Lock System
Maintains art style, color palette, lighting, composition, brush style, rendering style consistently across all generated images. Per-project storage.

### Character Consistency
Maintains face, hair, clothing, body shape, age, accessories, expressions consistently. Per-character lock storage with prompt injection.

### Seed Manager
Stores global, scene, character, environment seeds per project. Supports deterministic regeneration.

### Quality Profiles
Predefined profiles: Draft, Standard, High, Ultra with resolution/steps/CFG/sampler settings.

### Retry Strategy
Implements: retry same provider (max 3), modify parameters, fallback to alternative providers, request review. Avoids infinite loops.

### Image Cache
TTL-based cache keyed by prompt hash. Reuse existing images when possible.

### Provider Health Monitor
Tracks generation time, success rate, queue time, failure rate, quality score per provider. Auto-reduce usage of unstable providers.

### Image Validation
Verifies aspect ratio, prompt compliance, character/style consistency, resolution, artifact detection. Only validated images enter pipeline.

### Cost Tracking
Tracks images generated, provider usage, estimated cost, failed generations, retry count, cache hits per project.

### Provider Settings
Per-provider settings: resolution, guidance strength, seed control, style strength, inference quality, timeout, retry policy.

### Image Consistency AI
Compares newly generated images with previous scenes. Detects character drift, lighting inconsistencies, art-style deviations, composition conflicts. Auto-requests regeneration below threshold.

### Smart Image Reuse Engine
Before generating, analyzes prompt/scene/character/background similarity. Prefers reuse with motion/cropping/camera changes over regeneration.

### Provider Benchmark Database
Maintains long-term quality statistics: avg generation time, prompt fidelity, character consistency, style accuracy, failure rate, cost efficiency.

### Reference Asset System
Supports reusable reference assets: character sheets, environment references, color palettes, style boards, composition examples, thumbnail references.

### Channel DNA Style Enforcer
Verifies compliance with active Channel DNA: art style, character proportions, camera perspective, color language, lighting, emotional tone.

## Orchestrator
`IPImageProviderManager` composes all 19 sub-modules.
