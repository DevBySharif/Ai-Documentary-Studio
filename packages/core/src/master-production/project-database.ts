export class MPProjectDatabase {
  private store: Map<string, unknown> = new Map();

  save(key: string, data: unknown): void {
    this.store.set(key, data);
  }

  load(key: string): unknown | undefined {
    return this.store.get(key);
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  exists(key: string): boolean {
    return this.store.has(key);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}
