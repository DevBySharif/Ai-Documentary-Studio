# Naming Conventions & Code Organization Standards
These are the strict naming conventions for AI Documentary Studio:

- **Files/Folders**: Use `kebab-case` (e.g., `timeline-engine.ts`, `timeline-engine/`).
- **Classes**: Use `PascalCase`, noun-based with responsibility suffix (e.g., `TimelineEngine`).
- **Interfaces**: Use `PascalCase`, NO 'I' prefix (e.g., `RenderBackend`).
- **Types/Enums**: Use `PascalCase`. Enum members use `PascalCase`.
- **Functions**: Use verb phrases, `camelCase` (e.g., `loadProject()`). Avoid generic `run()`, `execute()`.
- **Variables**: Use `camelCase`. Avoid generic `tmp`, `obj`, `data`.
- **Constants**: Use `UPPER_SNAKE_CASE` (e.g., `DEFAULT_RENDER_FPS`).
- **React Components**: Use `PascalCase`, one per file matching filename.
- **React Hooks**: Must start with `use`.
- **Context**: Use `Provider` suffix for components, `Context` suffix for objects.
- **IPC Channels**: Format `domain:action` (e.g., `project:open`).
- **Events**: Use past tense describing completed actions (e.g., `ProjectOpened`).
- **Database**: Use `snake_case` (e.g., `render_jobs`, `created_at`).
- **Domain Language**: Strictly use terms: Project, Timeline, Clip, Track, Asset, Prompt, Channel DNA, Render Job, Motion Preset, Workspace.

# TypeScript Standards & Coding Guidelines
- **Type Safety**: Never use `any`. Prefer `unknown` and narrow types. Use explicit return types for public APIs.
- **Interfaces vs Types**: Use `interface` for contracts (public, repo, service, SDK). Use `type` for unions, mapped types, utility compositions.
- **Immutability**: Prefer immutable objects (`ReadonlyArray<T>`, `readonly` properties). Avoid mutating shared state.
- **Error Handling**: Throw typed errors. Never throw strings. Use `Result<T>` pattern for business logic flow; reserve exceptions for exceptional situations.
- **Async/Await**: Prefer `await` over chained `.then()`. All async ops should support cancellation, timeout, and typed errors.
- **Nullability**: Prefer `undefined` for optional values instead of `null` or empty string.
- **Enums**: Prefer `const enum` or literal unions.
- **Functions**: Do one thing. Return predictable outputs. Avoid generic `process()` names.
- **Dependencies**: Depend on interfaces/abstractions, not concrete infrastructure.
- **Architecture Boundaries**: Imports must follow: UI -> Application -> Domain -> Infrastructure. Never the reverse.
