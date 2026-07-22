# NEXT IMPLEMENTATION PLAN — AI DOCUMENTARY STUDIO

**Plan Date**: July 22, 2026  
**Objective**: Prioritized integration roadmap connecting UI application shells (`apps/web`, `apps/desktop`) and REST API (`apps/api`) to the implemented core architecture packages (`packages/core/src/`).

---

## 1. Critical Priority (Core Data Sync & Project Persistence)

1. **REST API Controller Linking (`@studio/api`)**:
   - Wire `apps/api/src/controllers/projectController.ts` to `@studio/core` domain services (`ProjectService`, `ProjectRepository`).
   - Implement real database CRUD persistence using `@studio/database` (SQLite Drizzle schema).

2. **Web Dashboard & Project Flow Linking (`@studio/web`)**:
   - Connect `DashboardPage` project list and creation form directly to `/api/projects`.
   - Wire `ProjectPage` workflow step wizard cards (Script, Prompt Pack, Images, Voice, Timeline, Preview) to active project state.

---

## 2. High Priority (AI Scripting & Voice Generation Integration)

1. **Script Engine Integration (`/script`)**:
   - Connect `ScriptPage` documentary idea form to `@studio/ai` LLM prompt generator and script structuring pipeline.
   - Store generated script scenes, narrations, and visual prompts in project state.

2. **Voice Engine Integration (`/voice`)**:
   - Connect `VoicePage` controls to `@studio/core` provider abstraction (`VoiceProviderManager`).
   - Enable voice model selection (Google Cloud TTS, ElevenLabs, local TTS) and audio file generation.

---

## 3. Medium Priority (Timeline Studio & Render Pipeline)

1. **Timeline Studio Compositor Integration (`/timeline`)**:
   - Connect Web & Desktop timeline UI views to `@studio/timeline` multi-track compositor.
   - Enable interactive clip dragging, trimming, snapping, and keyframe inspection.

2. **Preview & Render Export Integration (`/preview`)**:
   - Connect `PreviewPage` player canvas to `@studio/render` job queue and export engine.
   - Support preview playback and MP4 video rendering.

---

## 4. Low Priority (Channel DNA & Desktop Native IPC)

1. **Channel DNA & Settings Integration (`/settings`)**:
   - Wire `SettingsPage` forms to `@studio/dna` (Visual & Voice style profiles) and Knowledge Base context rules.

2. **Desktop Native IPC Expansion (`@studio/desktop`)**:
   - Expand `apps/desktop/src/main/ipc/router.ts` with native file system dialogues for local asset import, drag-and-drop file ingestion, and local export path selection.
