import type { SymbolDefinition } from "./types.js";

const DEFAULT_SYMBOLS: SymbolDefinition[] = [
  { symbol: "mirror", meaning: "identity", description: "A mirror reflecting a figure", visualStyle: "minimal", examples: ["self-reflection", "identity crisis"] },
  { symbol: "bird", meaning: "freedom", description: "A bird in flight", visualStyle: "minimal", examples: ["liberation", "escape", "perspective"] },
  { symbol: "galaxy", meaning: "infinity", description: "A spiral galaxy", visualStyle: "abstract", examples: ["cosmos", "infinite possibilities", "scale"] },
  { symbol: "brain", meaning: "knowledge", description: "A human brain silhouette", visualStyle: "minimal", examples: ["learning", "intelligence", "consciousness"] },
  { symbol: "door", meaning: "opportunity", description: "An open door with light", visualStyle: "minimal", examples: ["new beginnings", "choices", "transitions"] },
  { symbol: "tree", meaning: "life", description: "A lone tree", visualStyle: "minimal", examples: ["growth", "roots", "ancestry"] },
  { symbol: "clock", meaning: "time", description: "A clock with moving hands", visualStyle: "minimal", examples: ["passage of time", "urgency", "history"] },
  { symbol: "key", meaning: "answer", description: "A single key", visualStyle: "minimal", examples: ["solution", "discovery", "access"] },
  { symbol: "lamp", meaning: "idea", description: "A glowing lamp", visualStyle: "minimal", examples: ["insight", "enlightenment", "creativity"] },
  { symbol: "path", meaning: "journey", description: "A winding path", visualStyle: "minimal", examples: ["life journey", "choices", "direction"] },
  { symbol: "eye", meaning: "perception", description: "A stylized eye", visualStyle: "abstract", examples: ["awareness", "observation", "truth"] },
  { symbol: "spiral", meaning: "evolution", description: "A golden spiral", visualStyle: "geometric", examples: ["growth", "cycles", "progress"] },
];

export class SymbolLibraryManager {
  private symbols = new Map<string, SymbolDefinition>();

  constructor() {
    for (const s of DEFAULT_SYMBOLS) {
      this.symbols.set(s.symbol, s);
    }
  }

  get(symbol: string): SymbolDefinition | undefined {
    return this.symbols.get(symbol);
  }

  findByMeaning(meaning: string): SymbolDefinition[] {
    if (!meaning) return [];
    return Array.from(this.symbols.values()).filter((s) => s.meaning === meaning);
  }

  getAll(): SymbolDefinition[] {
    return Array.from(this.symbols.values());
  }

  register(symbol: SymbolDefinition): void {
    if (!symbol || !symbol.symbol) throw new Error("SymbolDefinition with a 'symbol' field is required");
    this.symbols.set(symbol.symbol, symbol);
  }

  resolveMeaning(symbol: string): string | undefined {
    return this.symbols.get(symbol)?.meaning;
  }

  getCompatibleSymbols(concept: string): SymbolDefinition[] {
    if (!concept) return [];
    const lower = concept.toLowerCase();
    return Array.from(this.symbols.values()).filter(
      (s) => s.meaning.includes(lower) || s.symbol.includes(lower) || s.description.includes(lower)
    );
  }
}
