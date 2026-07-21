export class SearchableKnowledgeBase {
  private index: Map<string, string> = new Map();

  indexDocument(docId: string, content: string): void {
    // Basic mock indexing
    this.index.set(docId, content.toLowerCase());
  }

  search(query: string): string[] {
    console.log(`Searching Knowledge Base for: "${query}"`);
    const q = query.toLowerCase();
    const results: string[] = [];
    
    for (const [id, content] of this.index.entries()) {
      if (content.includes(q)) {
        results.push(id);
      }
    }
    return results;
  }
}
