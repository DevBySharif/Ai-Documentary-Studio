import { PDEntityType } from "./types";

interface SearchDocument {
  entityId: string;
  content: string;
  entityTypes: Set<PDEntityType>;
}

interface SearchResult {
  entityId: string;
  score: number;
  snippet: string;
}

export class PDFullTextSearch {
  private documents = new Map<string, SearchDocument>();
  private searchCount = 0;
  private totalSearchTimeMs = 0;

  indexContent(entityId: string, content: string, entityTypes: PDEntityType[] = []): void {
    this.documents.set(entityId, {
      entityId,
      content: content.toLowerCase(),
      entityTypes: new Set(entityTypes),
    });
  }

  search(query: string, entityTypes?: PDEntityType[]): SearchResult[] {
    const start = performance.now();
    const q = query.toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);

    const results: SearchResult[] = [];

    for (const doc of this.documents.values()) {
      if (entityTypes && entityTypes.length > 0) {
        const hasType = entityTypes.some((t) => doc.entityTypes.has(t));
        if (!hasType) continue;
      }

      let score = 0;
      for (const term of terms) {
        const idx = doc.content.indexOf(term);
        if (idx !== -1) {
          score += term.length / doc.content.length;
        }
      }

      if (score > 0) {
        const snippetStart = Math.max(0, doc.content.indexOf(terms[0]) - 30);
        const snippetEnd = Math.min(doc.content.length, snippetStart + 80);
        let snippet = doc.content.slice(snippetStart, snippetEnd);
        if (snippetStart > 0) snippet = "..." + snippet;
        if (snippetEnd < doc.content.length) snippet += "...";

        results.push({ entityId: doc.entityId, score, snippet });
      }
    }

    results.sort((a, b) => b.score - a.score);

    const elapsed = performance.now() - start;
    this.searchCount++;
    this.totalSearchTimeMs += elapsed;

    return results;
  }

  rebuildIndex(): void {
    this.documents.clear();
    this.searchCount = 0;
    this.totalSearchTimeMs = 0;
  }

  getSearchStats(): { indexedDocs: number; avgSearchTime: number } {
    return {
      indexedDocs: this.documents.size,
      avgSearchTime: this.searchCount > 0 ? this.totalSearchTimeMs / this.searchCount : 0,
    };
  }
}
