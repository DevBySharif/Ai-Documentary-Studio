// Public API boundary for the timeline feature
// Other features must import from here, never deep-linking into components/ or hooks/ directly.

export { TimelineContainer } from "./components/timeline-container";
// We intentionally do NOT export TimelineView if it's considered an internal detail of the Timeline feature.
