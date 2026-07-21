# GPU Rendering Pipeline — Volume 03 Part 09

## Overview
Hardware-accelerated rendering pipeline that transforms the prepared production timeline into a high-quality video. Supports interchangeable backends, intelligent memory management, automatic encoder selection, and distributed rendering architecture.

## Modules

| Module | File | Description |
|--------|------|-------------|
| Types | `types.ts` | Core type definitions (backends, encoders, vendors, stages, shaders, buffers, tasks, usage, hardware profile, stats, cache, scheduler, mux config, contract, validation, AI decisions, benchmarks, distributed chunks, zenn profile) |
| Render Stages | `render-stages.ts` | Fixed sequence: frame loading → texture upload → scene rendering → effect rendering → subtitle rendering → frame encoding → video muxing |
| Render Backend | `render-backend.ts` | Interchangeable backends (FFmpeg, Remotion, WebGPU, OpenGL, Vulkan) with common `GRBackendAPI` interface |
| GPU Memory Manager | `gpu-memory-manager.ts` | Manages texture memory, frame buffers, shader cache, temp buffers, render targets with auto-free |
| Texture Streaming | `texture-streaming.ts` | Load current scene, preload next, unload old; reduces memory usage |
| Tile Rendering | `tile-rendering.ts` | Splits large frames (4K/8K) into configurable tiles for rendering |
| Multi-Thread Renderer | `multi-thread-renderer.ts` | Separates CPU (timeline/scheduling/audio) and GPU (motion/effects/compositing/encoding) tasks |
| Hardware Detection | `hardware-detection.ts` | Auto-detect GPU vendor, VRAM, CPU cores, RAM, encoder, OS |
| Hardware Encoders | `hardware-encoders.ts` | NVENC/Quick Sync/AMF/VideoToolbox/software with auto-selection |
| Shader Pipeline | `shader-pipeline.ts` | Reusable shaders (blur, glow, depth, grain, subtitle, transition) |
| Frame Buffer Manager | `frame-buffer-manager.ts` | Maintains current/previous/next frame + intermediate/render buffers with swap |
| Render Cache | `render-cache.ts` | LRU eviction cache for static layers, repeated effects, subtitle glyphs, textures, motion data |
| GPU Task Scheduler | `gpu-task-scheduler.ts` | Priority-sorted scheduling for texture upload, shader execution, motion rendering, frame encoding |
| Video Muxer | `video-muxer.ts` | Combines video + audio + subtitles + chapters into final container |
| Performance Optimizer | `performance-optimizer.ts` | Auto-tunes cache size, effect quality, parallelism based on hardware profile |
| Zenn Render Profile | `zenn-render-profile.ts` | Default documentary rendering (hardware-accelerated, high-quality, stable, efficient) |
| AI Render Optimizer | `ai-render-optimizer.ts` | Predicts bottlenecks, optimizes texture loading order, adjusts caches, reduces GPU spikes, estimates remaining time |
| Smart Hardware Profiler | `smart-hardware-profiler.ts` | Persistent hardware profile (GPU model, drivers, VRAM, benchmarks, render stats, thermal) — learns best strategy over time |
| Distributed Render Prep | `distributed-render-prep.ts` | Splits projects into chunks for future multi-machine/cloud rendering |
| Validator | `validator.ts` | 6-point pre-encoding validation (GPU memory, frame queue, subtitles, audio, profile, encoder) |
| Output Contract | `output-contract.ts` | Final render contract (backend, encoder, fps, resolution, render time, status) |
| GPU Rendering Engine | `gpu-rendering.ts` | `GRGPURenderingEngine` — top-level orchestrator composing all 22 sub-engines |

## Key Design Decisions
- All 23 modules composable via `GRGPURenderingEngine`
- Render backends interchangeable through `GRBackendAPI` interface
- Memory manager auto-frees unused resources
- Encoder auto-selection based on detected hardware
- AI Optimizer improves performance without affecting visual quality
- Distributed architecture built in from the start (optional, non-blocking)
- Zenn profile provides one-click professional documentary render defaults
