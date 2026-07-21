export class WMSmartProjectIndex {
  private index: Map<string, string[]> = new Map();

  indexAsset(category: string, key: string, value: string): void {
    const keyStr = `${category}:${key}`;
    if (!this.index.has(keyStr)) this.index.set(keyStr, []);
    this.index.get(keyStr)!.push(value);
  }

  search(category: string, query: string): string[] {
    const results: string[] = [];
    for (const [key, values] of this.index) {
      if (key.startsWith(`${category}:`) && key.toLowerCase().includes(query.toLowerCase())) {
        results.push(...values);
      }
    }
    return results;
  }

  remove(category: string, key: string): void {
    this.index.delete(`${category}:${key}`);
  }

  clear(): void {
    this.index.clear();
  }
}
