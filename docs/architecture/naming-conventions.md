# Naming Conventions & Code Organization Standards

**Version**: 1.0
**Status**: Foundation
**Priority**: Critical

## 1. Objective
This document defines the canonical naming conventions and code organization standards for AI Documentary Studio.
Consistent naming improves readability, maintainability, refactoring, code review, discoverability, IDE navigation, team collaboration, and documentation quality. Naming conventions are mandatory across the entire codebase.

## 2. Design Principles
All code shall be:
- Consistent
- Explicit
- Predictable
- Self-documenting
- Technology Independent
- Domain Focused
- Refactoring Friendly
- IDE Friendly
- Scalable
- Unambiguous

Names should communicate intent rather than implementation.

## 3. General Rules
Use:
- English only.
- Singular nouns for entities.
- Plural nouns for collections.
- PascalCase for types.
- camelCase for variables.
- UPPER_SNAKE_CASE for compile-time constants.
- kebab-case for folders.
- kebab-case for file names unless framework conventions require otherwise.

Avoid abbreviations unless universally recognized.

## 4. File Naming
**Rules**: Lowercase. Hyphen separated (kebab-case). One responsibility per file.
**Examples**:
- `timeline-engine.ts`
- `render-job.ts`
- `asset-service.ts`
- `project-repository.ts`

## 5. Folder Naming
**Rules**: Lowercase. Hyphen separated. Represent architectural responsibilities.
**Examples**:
- `timeline-engine/`
- `render-graph/`
- `plugin-runtime/`

## 6. Class Naming
**Rules**: PascalCase. Noun based. Suffix indicates responsibility.
**Examples**:
- `TimelineEngine`
- `RenderPlanner`
- `ProjectRepository`

## 7. Interface Naming
**Rules**: Do not prefix interfaces with `I`. Interfaces represent contracts, not implementation details.
**Good**: `TimelineRepository`, `RenderBackend`, `AIProvider`
**Avoid**: `ITimelineRepository`, `IAIProvider`

## 8. Type Aliases
**Rules**: PascalCase.
**Examples**: `RenderOptions`, `TimelineSnapshot`, `PromptContext`

## 9. Enum Naming
**Rules**: PascalCase. Avoid numeric prefixes or abbreviations.
**Examples**: `RenderStatus`, `ProjectState`
**Enum Members**: PascalCase (e.g., `Pending`, `Running`, `Completed`, `Failed`)

## 10. Function Naming
**Rules**: Use verb phrases. Avoid generic names like `doStuff()`, `run()`, `handle()`, `execute()` without context.
**Examples**: `loadProject()`, `compilePrompt()`, `renderFrame()`, `calculateTimeline()`

## 11. Variable Naming
**Rules**: camelCase. Avoid `tmp`, `obj`, `data`, `test` unless scope is extremely limited.
**Examples**: `project`, `renderJob`, `timelineTrack`, `activeClip`

## 12. Constants
**Rules**: Compile-time constants use UPPER_SNAKE_CASE. Configuration values should not be hardcoded.
**Examples**: `DEFAULT_RENDER_FPS`, `MAX_TIMELINE_TRACKS`

## 13. React Components
**Rules**: PascalCase. One component per file. Component name matches file name.
**Examples**: `TimelinePanel`, `AssetBrowser`, `InspectorSidebar`

## 14. React Hooks
**Rules**: Hooks begin with `use`. Never omit the `use` prefix.
**Examples**: `useTimeline()`, `useProject()`, `useRenderQueue()`

## 15. Context Providers
**Rules**: Use `Provider` suffix for components, `Context` suffix for context objects.
**Examples**: `ProjectProvider`, `ProjectContext`

## 16. IPC Channel Naming
**Pattern**: `domain:action`
**Examples**: `project:open`, `render:start`, `ai:generate`
**Avoid**: ambiguous names such as `start`, `save`, `run`

## 17. Event Naming
**Rules**: Events describe completed actions. Use past-tense naming. Avoid imperative names.
**Examples**: `ProjectOpened`, `TimelineUpdated`, `RenderCompleted`

## 18. Database Naming
**Rules**: Use `snake_case` consistently for database identifiers.
**Tables**: `projects`, `assets`, `render_jobs`
**Columns**: `created_at`, `project_id`

## 19. Import Order
Order imports consistently. Separate groups with one blank line.
1. External libraries
2. Internal packages
3. Domain
4. Application
5. Infrastructure
6. Local modules
7. Relative imports

## 20. Barrel Export Strategy
Each package may expose `index.ts`. Only public APIs are exported. Internal modules remain private. Avoid wildcard exports for unstable internals.

## 21. Git Branch Naming
**Pattern**: `type/description`
**Examples**: `feature/timeline-engine`, `fix/render-memory-leak`, `refactor/plugin-runtime`

## 22. Commit Conventions
**Pattern**: `type(scope): description`
**Examples**: `feat(render): add incremental rendering`, `fix(database): resolve migration issue`

## 23. Code Organization (Within File)
1. Imports
2. Constants
3. Types
4. Interfaces
5. Class
6. Helper Functions
7. Exports

## 24. Domain Language
All names should align with the project's ubiquitous language.
**Preferred terms**: Project, Timeline, Clip, Track, Asset, Prompt, Channel DNA, Render Job, Motion Preset, Workspace.
Avoid synonyms for the same domain concept.
