import { ExtractedFact } from "./research-types";

export interface ResearchTimelineEntry {
  readonly entryId: string;
  readonly dateString: string;
  readonly timestamp?: Date;
  readonly eventTitle: string;
  readonly description: string;
  readonly location?: string;
  readonly participants: ReadonlyArray<string>;
  readonly supportingFacts: ReadonlyArray<ExtractedFact>;
  readonly confidence: number;
}

/**
 * Chronological Timeline Generator (Vol 04 Part 02 - Section 10).
 * Constructs structured chronological timelines from extracted research facts.
 */
export class TimelineGenerator {
  public generateTimeline(facts: ReadonlyArray<ExtractedFact>): ReadonlyArray<ResearchTimelineEntry> {
    const entries: ResearchTimelineEntry[] = facts
      .filter((f) => f.category === "Date" || f.category === "Event")
      .map((f, idx) => ({
        entryId: `tl_${idx}_${Math.random().toString(36).substring(2, 7)}`,
        dateString: f.statement.split(":")[0] || "Undated",
        eventTitle: f.statement,
        description: `Chronological entry derived from research fact #${idx + 1}`,
        participants: [],
        supportingFacts: [f],
        confidence: f.confidence,
      }));

    return entries;
  }
}
