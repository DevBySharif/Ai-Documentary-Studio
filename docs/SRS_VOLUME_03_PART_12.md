# Production Director AI — Volume 03 Part 12

## Overview
Central orchestration system coordinating every stage of documentary production. Makes intelligent decisions, schedules all engines, validates outputs, maintains consistency, and guarantees Channel DNA compliance.

## Modules

| Module | File | Description |
|--------|------|-------------|
| Types | `types.ts` | Core type definitions (stages, engine types, decisions, severity, resources, schedules, continuity, regeneration, failure, DNA enforcement, plugins, explanations, memory, contract) |
| Master Decision Engine | `master-decision-engine.ts` | Central controller for all production decisions (approve/reject/regenerate/adjust) |
| Pipeline Orchestration | `pipline-orchestration.ts` | Fixed execution order: script → prompt → images → voice → timeline → motion → effects → QA → export |
| Channel DNA Enforcement | `channel-dna-enforcement.ts` | 8-dimension verification (story, character, art, prompt, motion, subtitle, color, camera) |
| Scene Approval System | `scene-approval-system.ts` | Generated → Validated → Approved → Locked workflow with regeneration requests |
| Regeneration Manager | `regeneration-manager.ts` | Selective regeneration (single/dependent/full scope) based on issue severity |
| Continuity Manager | `continuity-manager.ts` | 7-dimension continuity (characters, clothing, environment, lighting, camera, color palette, transitions) |
| Priority Manager | `priority-manager.ts` | Production priority: script > voice > timeline > image > motion > effects > export |
| Failure Recovery | `failure-recovery.ts` | Identifies failed stage, preserves completed work, restarts only failed module |
| Resource Manager | `resource-manager.ts` | CPU/GPU/RAM/disk/network monitoring and allocation |
| Task Scheduler | `task-scheduler.ts` | Sequential/parallel/background task scheduling with priority queue |
| Project State Machine | `project-state-machine.ts` | Planning → Generating → Review → Rendering → QA → Export → Published |
| User Interaction | `user-interaction.ts` | Current stage, progress, warnings, estimated time, resource usage, quality status display |
| Zenn Director Profile | `zenn-director-profile.ts` | Default production philosophy (story first, calm pacing, high consistency, minimal effects) |
| Production Memory | `production-memory.ts` | Persistent project memory across all stages (scripts, prompts, images, voice, timeline, motion, QA) |
| Intelligent Regeneration Graph | `intelligent-regeneration-graph.ts` | Dependency tracking — only regenerate affected components |
| AI Decision Explainer | `ai-decision-explainer.ts` | Every decision includes a human-readable explanation (camera reduced due to subtitles, transition delayed for pause, image regenerated for DNA) |
| Plugin Orchestration Layer | `plugin-orchestration-layer.ts` | Pluggable LLM/image/TTS/transcription/render/QA providers with hot-swap |
| Future Autonomous Mode | `future-autonomous-mode.ts` | One-Click Documentary workflow (topic → script → prompts → images → voice → video → QA → export) |
| Validator | `validator.ts` | 6-point pre-continuation validation (previous stage, assets, timeline, audio, scene, DNA) |
| Output Contract | `output-contract.ts` | Project/scenes/QA/export/status contract |
| Production Director AI | `production-director.ts` | `PDProductionDirectorAI` — top-level orchestrator composing all 22 sub-engines |
