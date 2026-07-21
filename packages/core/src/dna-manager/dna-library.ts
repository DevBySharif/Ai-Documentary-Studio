import type { DNASection } from "./types.js";

export class DNALibrary {
  private library: Map<string, { name: string; dna: DNASection }> = new Map();

  register(id: string, name: string, dna: DNASection): void {
    this.library.set(id, { name, dna: { ...dna } });
  }

  get(id: string): { name: string; dna: DNASection } | undefined {
    const entry = this.library.get(id);
    return entry ? { ...entry, dna: { ...entry.dna } } : undefined;
  }

  getAll(): Array<{ id: string; name: string }> {
    return Array.from(this.library.entries()).map(([id, entry]) => ({ id, name: entry.name }));
  }

  clone(id: string, newId: string): boolean {
    const entry = this.library.get(id);
    if (!entry) return false;
    this.library.set(newId, { name: `${entry.name} (Clone)`, dna: { ...entry.dna } });
    return true;
  }

  remove(id: string): boolean {
    return this.library.delete(id);
  }
}
