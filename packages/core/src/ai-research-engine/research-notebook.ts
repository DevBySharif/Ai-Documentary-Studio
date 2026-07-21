import { ExtractedFact, DetectedEntity } from "./research-types";

export interface ResearchNotebookEntry {
  readonly entryId: string;
  readonly category: "Fact" | "Entity" | "Observation" | "UserNote" | "OpenQuestion";
  readonly title: string;
  readonly content: string;
  readonly isPinned: boolean;
  readonly createdAt: Date;
}

/**
 * Structured Research Notebook (Vol 04 Part 02 - Section 12, Section 14).
 * Stores facts, entities, citations, observations, user notes, and open questions.
 */
export class ResearchNotebook {
  private entries: ResearchNotebookEntry[] = [];

  public addEntry(category: ResearchNotebookEntry["category"], title: string, content: string, isPinned = false): ResearchNotebookEntry {
    const entry: ResearchNotebookEntry = {
      entryId: `nb_${Math.random().toString(36).substring(2, 9)}`,
      category,
      title,
      content,
      isPinned,
      createdAt: new Date(),
    };
    this.entries.push(entry);
    return entry;
  }

  public getPinnedEntries(): ReadonlyArray<ResearchNotebookEntry> {
    return this.entries.filter((e) => e.isPinned);
  }

  public getAllEntries(): ReadonlyArray<ResearchNotebookEntry> {
    return this.entries;
  }
}
