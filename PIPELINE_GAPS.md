# PIPELINE INTEGRATION GAPS — AI DOCUMENTARY STUDIO

This report details the verified backend, API, IPC, and third-party integration gaps across the 9 pipeline stages.

---

## 1. Project Persistence Gap
- **Location**: [`apps/api/src/controllers/projectController.ts`](file:///d:/Youtube/Ai%20Documentary%20Studio/apps/api/src/controllers/projectController.ts)
- **Verified Gap**: All Drizzle ORM database operations (`list`, `get`, `create`, `update`, `delete`) return HTTP status `501 Not implemented for Drizzle yet`.
- **Required Action**: Implement Drizzle ORM schema queries (`projects`, `timelines`, `assets`) using SQLite/PostgreSQL pool.

---

## 2. LLM AI Script Engine Integration Gap
- **Location**: `packages/core` & `apps/api/src/routes`
- **Verified Gap**: Missing backend service endpoint to route script generation requests to OpenAI / Anthropic / Gemini API key endpoints.
- **Required Action**: Create `/api/ai/generate-script` endpoint connected to LLM prompt templates and scene parser.

---

## 3. Prompt Pack Engine Integration Gap
- **Location**: `packages/core/src/prompts`
- **Verified Gap**: Lack of automated scene narrative-to-prompt extraction service.
- **Required Action**: Implement prompt formulation service to generate diffusion prompts per scene.

---

## 4. Image Generation Provider Integration Gap
- **Location**: `packages/core/src/images`
- **Verified Gap**: Image generation providers (Google Flow, Imagen, Midjourney, Stable Diffusion) are defined in types but missing SDK HTTP client implementations.
- **Required Action**: Implement image synthesis provider wrappers and image asset file storage under project workspace directories.

---

## 5. Voice TTS Provider Integration Gap
- **Location**: `packages/core/src/voice`
- **Verified Gap**: TTS synthesis clients (ElevenLabs, Google Cloud Neural TTS, OpenAI TTS) are missing binary audio buffer processing.
- **Required Action**: Wire ElevenLabs / OpenAI TTS client to output `.wav` / `.mp3` audio files and save under `assets/audio/`.

---

## 6. Timeline Clip Compositor Integration Gap
- **Location**: `apps/desktop/src/renderer/features/timeline`
- **Verified Gap**: Timeline store lacks drag-and-drop clip repositioning handlers, clip trimming logic, and timeline state persistence IPC (`IpcChannels.PROJECT.SAVE`).
- **Required Action**: Implement Zustand timeline state persistence and IPC save handler.

---

## 7. Video Player Stream Preview Gap
- **Location**: `apps/desktop/src/renderer/routes/index.tsx`
- **Verified Gap**: Video player modal displays a static graphics text container instead of a HTML5 Video / Canvas stream renderer.
- **Required Action**: Connect HTML5 `<video>` element or Canvas renderer to stream compiled timeline previews.

---

## 8. FFmpeg Render Engine Integration Gap
- **Location**: `packages/core/src/render` & `apps/desktop/src/main/ipc`
- **Verified Gap**: `IpcChannels.RENDER.START` handler is missing in Electron main process (`apps/desktop/src/main/ipc/router.ts`). FFmpeg process invocation is not connected.
- **Required Action**: Register `IpcChannels.RENDER.START` handler in main process to launch `fluent-ffmpeg` / `ffmpeg` executable.

---

## 9. Disk File Export Integration Gap
- **Location**: `apps/desktop/src/main/ipc`
- **Verified Gap**: Export action relies on React UI notification banner without performing file system write operations.
- **Required Action**: Connect native file dialog (`dialog.showSaveDialog`) to write compiled MP4 video stream to user's destination folder.
