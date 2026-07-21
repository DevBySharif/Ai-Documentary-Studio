import { MemoryItem } from "./memory-types";
import { VectorSearchResult } from "./vector-store";

export interface RankedContextItem {
  readonly item: MemoryItem;
  readonly finalScore: number;
  readonly scope: "CurrentTask" | "CurrentProject" | "Workspace" | "Global";
}

/**
 * Context Ranker & Hierarchical Retriever (IB Part 19 - Section 13, Section 21).
 * Hierarchical order: Current Task -> Current Project -> Workspace -> Global Knowledge.
 */
export class ContextRanker {
  public rank(
    searchResults: ReadonlyArray<VectorSearchResult>,
    activeProjectId?: string,
    maxContextItems = 5
  ): ReadonlyArray<RankedContextItem> {
    const ranked: RankedContextItem[] = searchResults.map((res) => {
      let scope: RankedContextItem["scope"] = "Global";
      let projectMultiplier = 1.0;

      if (res.item.projectId && res.item.projectId === activeProjectId) {
        scope = "CurrentProject";
        projectMultiplier = 1.5;
      } else if (res.item.projectId) {
        scope = "Workspace";
        projectMultiplier = 1.1;
      }

      const recencyMultiplier = 1.0; // Expandable based on date
      const finalScore = res.similarityScore * projectMultiplier * recencyMultiplier;

      return {
        item: res.item,
        finalScore: Math.round(finalScore * 1000) / 1000,
        scope,
      };
    });

    ranked.sort((a, b) => b.finalScore - a.finalScore);
    return ranked.slice(0, maxContextItems);
  }
}
