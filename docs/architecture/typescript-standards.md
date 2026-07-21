# TypeScript Standards & Coding Guidelines

**Version**: 1.0
**Status**: Foundation
**Priority**: Critical

## 1. Objective
This specification defines the TypeScript development standards for AI Documentary Studio. The goals are to maximize type safety, reduce runtime errors, improve maintainability, enable safe refactoring, increase IDE assistance, and maintain architectural consistency.

The codebase shall prioritize correctness over brevity.

## 2. Design Principles
TypeScript usage shall be:
- Strict
- Explicit
- Predictable
- Immutable by Default
- Refactoring Friendly
- Domain Driven
- Runtime Safe
- Testable
- Framework Independent
- Self Documenting

## 3. Compiler Configuration
Required compiler policies:
```json
"strict": true
"noImplicitAny": true
"strictNullChecks": true
"noUncheckedIndexedAccess": true
"exactOptionalPropertyTypes": true
"noImplicitOverride": true
"noFallthroughCasesInSwitch": true
"useUnknownInCatchVariables": true
```
Compiler warnings should be treated as build failures where practical.

## 4. Type Safety
- **Never use `any`**. Prefer `unknown` over `any`.
- Narrow types before use.
- Prefer explicit return types for public APIs.
- Avoid unnecessary type assertions (`as`).

## 5. Interfaces vs Types
Use `interface` for:
- Public contracts.
- Repository contracts.
- Service contracts.
- SDK contracts.

Use `type` for:
- Unions.
- Mapped types.
- Utility compositions.
- Function signatures.
- Conditional types.

## 6. Immutability
Prefer immutable objects.
- Use `readonly id: string;`
- Use `ReadonlyArray<Project>;`
- Avoid mutating shared state directly.

## 7. Error Handling
- Throw typed errors (e.g., `throw new ProjectLoadError(message)`).
- Never throw strings.
- Preserve original causes where supported.
- Catch only when recovery is possible.

## 8. Async/Await
- Prefer `await`. Avoid deeply chained `.then()`.
- Every async operation should support cancellation, propagate typed errors, and respect timeouts.

## 9. Generics
- Use generics when behavior is independent of concrete types (e.g., `Repository<T>`, `Result<T>`).
- Avoid unnecessary generic complexity.

## 10. Nullability
- Prefer `undefined` for optional values.
- Avoid mixing `null`, `undefined`, and empty strings to represent the same state.

## 11. Domain Modeling
- Represent domain concepts using Entities, Value Objects, Aggregates, Domain Events.
- Avoid primitive obsession. Prefer `ProjectId` instead of `string` where the domain benefits from stronger typing.

## 12. Enums
- Prefer `const enum` or literal unions. Choose the approach based on serialization, runtime requirements, and tooling compatibility.

## 13. Function Design
- Do one thing.
- Be side-effect aware.
- Have explicit inputs.
- Return predictable outputs.
- Prefer explicit naming (e.g., `calculateDuration()` over `process()`).

## 14. Class Design
- Follow Single Responsibility.
- Avoid God Objects.
- Prefer constructor injection.
- Hide implementation details.
- Expose behavior rather than mutable state.

## 15. Dependency Management
- Depend on Interfaces, Abstractions, Contracts.
- Avoid direct dependency on concrete infrastructure implementations.

## 16. Validation
- Validate external input, IPC payloads, AI responses, Plugin messages, Configuration files.
- Internal domain objects should assume validated inputs whenever appropriate.

## 17. Result Pattern
- Expected operation outcomes should favor explicit success/failure models (e.g., `Result<T>`).
- Reserve exceptions for exceptional situations.

## 18. Comments
- Comments should explain Why, Constraints, Business rules, Architectural decisions.
- Avoid comments that merely restate code.

## 19. Linting
- Linting rules should enforce: No unused variables, No floating promises, No implicit any, Consistent imports, Consistent return paths, Explicit accessibility modifiers.
- Lint violations block merges unless explicitly justified.

## 20. Formatting
- Formatting should be automated (Prettier, ESLint integration).
- Formatting decisions are not debated during code review.

## 21. Performance Guidelines
- Avoid unnecessary object allocation, excessive cloning, deep recursion, large synchronous loops on the UI thread.
- Measure before optimizing.

## 22. Testability
- Code should support dependency injection, minimize hidden state, avoid global mutable variables, separate pure logic from side effects.
- Testability is considered during design, not after implementation.

## 23. Documentation
- Public APIs should include: Purpose, Parameters, Return value, Error conditions, Usage notes.

## 24. Architectural Boundaries
TypeScript imports must respect architectural layers:
- **Allowed direction**: UI -> Application -> Domain -> Infrastructure (implements contracts).
- **Forbidden**: Domain importing Renderer, Domain importing Electron, Domain importing React, Domain importing database drivers directly.
