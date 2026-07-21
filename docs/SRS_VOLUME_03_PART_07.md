# Audio Mixing Engine — Volume 03 Part 07

## Overview
Professional audio mixing engine combining narration, background music, ambient sound, and sound effects into a balanced, broadcast-ready soundtrack. Narration always remains the primary storytelling element.

## Modules

| Module | File | Description |
|--------|------|-------------|
| Types | `types.ts` | Core type definitions (layer types, ambient types, SFX types, EQ bands, noise types, stereo modes, reverb types, export profiles, scene emotions, AI decisions, quality reports, mastering profiles, validation, output contract) |
| Layer Manager | `layer-manager.ts` | Multi-layer sync (narration, BGM, ambience, SFX, transitions) with independent volume/pan/mute/solo/EQ/compressor per layer |
| Narration Priority | `narration-priority.ts` | Ensures narration always dominant (never masked, never clipped, never distorted, preserves dynamics) |
| Music Ducking | `music-ducking.ts` | Automatic volume reduction during speech with configurable attack/release |
| Ambient Engine | `ambient-engine.ts` | 7 ambient presets (room tone, wind, rain, forest, city, space, ocean) with fade in/out |
| Sound Effects | `sound-effects.ts` | 6 SFX types (whoosh, transition, impact, click, page turn, light atmosphere) with scheduling |
| Equalizer | `equalizer.ts` | Independent 6-band EQ per layer (sub, low, low-mid, mid, high-mid, high) with gentle corrections |
| Compressor | `compressor.ts` | Configurable threshold/ratio/attack/release/makeup gain, narration-optimized defaults |
| Limiter | `limiter.ts` | Ceiling-based final protection against clipping/peak distortion/volume spikes |
| Loudness Normalization | `loudness-normalization.ts` | Configurable LUFS targets (integrated, short-term, true peak) per export profile |
| Noise Reduction | `noise-reduction.ts` | 4 noise types (background, hum, static, low rumble) with per-type reduction amounts |
| Stereo Imaging | `stereo-imaging.ts` | Mono narration, stereo music/ambience, controlled stereo width |
| Reverb Manager | `reverb-manager.ts` | 5 reverb types (none, room, hall, plate, chamber) with mix/decay/pre-delay |
| Master Bus | `master-bus.ts` | Fixed processing chain: EQ → Compression → Limiter → Loudness → Export |
| AI Sound Director | `ai-sound-director.ts` | Scene-aware automatic adjustments (9 emotions) for music level, ambience, ducking depth, dynamic range |
| Adaptive Music Engine | `adaptive-music.ts` | Intelligent music segmentation (intro/outro fades, crossfading, energy matching, emotional mapping) |
| Audio Quality AI | `audio-quality-ai.ts` | 6-metric quality analysis (clipping, compression, harsh frequencies, voice masking, loudness, noise) + auto-correction |
| Multi-Profile Mastering | `multi-profile-mastering.ts` | 6 destination profiles (YouTube long/shorts, podcast, Instagram, TikTok, lossless archive) |
| Zenn Audio Profile | `zenn-profile.ts` | Default documentary mix (warm narration, soft music, subtle ambience, gentle ducking, minimal compression, clean EQ) |
| Validator | `validator.ts` | 6-point pre-export validation (clipping, loudness, voice clarity, ducking, stereo, noise) |
| Output Contract | `output-contract.ts` | Final mix contract (voice clean, music balanced, loudness profile, true peak safe, status) |
| Audio Mixer | `audio-mixer.ts` | `AMAudioMixingEngine` — top-level orchestrator composing all 21 sub-engines |

## Key Design Decisions
- All 22 modules composable via `AMAudioMixingEngine`
- Narration always has highest priority with minimum 4dB gap enforcement
- AI Sound Director evaluates 5 context dimensions (emotion, narration intensity, camera, visual complexity, silence)
- 6 export profiles preserve artistic intent while optimizing technical delivery
- Quality AI can auto-correct issues before export
- Zenn profile provides one-click professional documentary mix defaults
