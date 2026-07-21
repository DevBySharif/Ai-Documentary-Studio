# Frame Scheduler — Volume 03 Part 08

## Overview
The master timing engine responsible for synchronizing every visual and audio event throughout the production pipeline. Guarantees frame-accurate execution of narration, motion, subtitles, effects, transitions, and rendering.

## Modules

| Module | File | Description |
|--------|------|-------------|
| Types | `types.ts` | Core type definitions (framerate, transition types, event types, drift types, keyframe types, recovery states, master clock, frame state, camera/subtitle/effect/audio states, events, batches, cache, keyframes, corrections, contract, validation, AI decisions, checkpoints, workload units, zenn profile) |
| Master Clock | `master-clock.ts` | Production clock owned by frame scheduler; all subsystems reference this clock; tick/start/stop/fps/scene management |
| Frame Timeline | `frame-timeline.ts` | Generates deterministic frame states (frame number, timestamp, scene, camera, subtitle, effect, audio) |
| Event Scheduler | `event-scheduler.ts` | Converts every action to scheduled events (scene start/end, camera move, subtitle show/hide, word highlight, transition, effect start/end) |
| Audio Sync | `audio-sync.ts` | Narration→word highlight→motion→subtitle→transition sync; drift detection and alignment |
| Motion Sync | `motion-sync.ts` | Converts camera paths to frame events; interpolation between camera keyframes |
| Subtitle Sync | `subtitle-sync.ts` | Frame-accurate sentence/phrase/word/keyword/animation scheduling |
| Effect Sync | `effect-sync.ts` | Manages per-frame effect activation (fade, glow, blur, light rays, particles, vignette) |
| Transition Scheduler | `transition-scheduler.ts` | 5 transition types (crossfade, dip to black, light fade, blur, motion match) with overlap prevention |
| Render Batching | `render-batching.ts` | Groups frames into batches, merge support, improves rendering performance |
| Frame Cache | `frame-cache.ts` | Maintains previous frames, current batch, upcoming frames with configurable max |
| Keyframe Manager | `keyframe-manager.ts` | Unified timeline for camera/subtitle/effect/opacity/scale/rotation keyframes with interpolation |
| Timeline Resampler | `timeline-resampler.ts` | 24/25/30/50/60 FPS conversion without drifting |
| Timing Correction | `timing-correction.ts` | Detects dropped frames, timing/audio/subtitle/motion drift; auto-compensates minor drift |
| Zenn Timing Profile | `zenn-timing-profile.ts` | Default documentary timing (slow pacing, long holds, gentle transitions, frame-perfect subtitles) |
| AI Timing Controller | `ai-timing-controller.ts` | Extends holds during reflection, delays transitions for dramatic pauses, accelerates low-information scenes, synchronizes emotional peaks |
| Global Event Bus | `global-event-bus.ts` | Unified pub/sub for all render events (12 event types) eliminating duplicated timing logic |
| Frame Recovery | `frame-recovery.ts` | Checkpoint-based recovery (store nearest valid checkpoint, resume without restarting) |
| Adaptive Distributor | `adaptive-distributor.ts` | Optimizes rendering workload (GPU-intensive grouping, scene grouping, cache-friendly batches, CPU/GPU balancing) |
| Validator | `validator.ts` | 6-point pre-render validation (frame count, audio/subtitle/camera alignment, effect timing, timeline integrity) |
| Output Contract | `output-contract.ts` | Final contract (fps, frames, events, sync status, ready status) |
| Frame Scheduler | `frame-scheduler.ts` | `FSFrameSchedulerEngine` — top-level orchestrator composing all 22 sub-engines |

## Key Design Decisions
- All 23 modules composable via `FSFrameSchedulerEngine`
- Master clock is the single source of truth; no independent timing allowed
- Every frame is deterministic and fully described by `FMFrameState`
- 12 event types published through `FSGlobalEventBus` eliminate duplicated timing logic
- AI Timing Controller respects approved script/duration while optimizing timing
- Checkpoint-based recovery resumes from nearest valid checkpoint instead of restarting
- Adaptive distributor balances CPU/GPU workloads for long-form documentary efficiency
