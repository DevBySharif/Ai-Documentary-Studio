export interface SymbolMemoryEntry {
  symbol: string;
  permanentMeaning: string;
  associatedConcepts: string[];
  bestImageId: string;
  visualStyle: string;
  projectOrigins: string[];
  reuseCount: number;
}

export class SymbolMemory {
  private symbols = new Map<string, SymbolMemoryEntry>();

  store(entry: SymbolMemoryEntry): void {
    if (!entry?.symbol) throw new Error("SymbolMemoryEntry with symbol is required");
    const existing = this.symbols.get(entry.symbol);
    if (existing) {
      existing.reuseCount++;
      existing.associatedConcepts = [...new Set([...existing.associatedConcepts, ...entry.associatedConcepts])];
      if (!existing.projectOrigins.includes(entry.symbol)) existing.projectOrigins.push(...entry.projectOrigins);
    } else {
      this.symbols.set(entry.symbol, { ...entry, reuseCount: 1 });
    }
  }

  get(symbol: string): SymbolMemoryEntry | undefined {
    return this.symbols.get(symbol);
  }

  findByConcept(concept: string): SymbolMemoryEntry[] {
    if (!concept) return [];
    const lower = concept.toLowerCase();
    return Array.from(this.symbols.values()).filter(
      (e) => e.symbol.toLowerCase().includes(lower) || e.associatedConcepts.some((c) => c.toLowerCase().includes(lower))
    );
  }

  getAll(): SymbolMemoryEntry[] {
    return Array.from(this.symbols.values());
  }
}
