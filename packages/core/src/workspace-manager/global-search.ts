export class WMGlobalSearch {
  private entries: Map<string, { category: string; label: string }> = new Map();

  index(id: string, category: string, label: string): void {
    this.entries.set(id, { category, label });
  }

  search(query: string): Array<{ id: string; category: string; label: string }> {
    const lower = query.toLowerCase();
    const results: Array<{ id: string; category: string; label: string }> = [];
    for (const [id, entry] of this.entries) {
      if (entry.label.toLowerCase().includes(lower) || entry.category.toLowerCase().includes(lower)) {
        results.push({ id, ...entry });
      }
    }
    return results;
  }

  remove(id: string): void {
    this.entries.delete(id);
  }

  clear(): void {
    this.entries.clear();
  }
}
