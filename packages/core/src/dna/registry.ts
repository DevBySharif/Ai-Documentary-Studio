import { DNAManager } from "./manager.js";
import type { ChannelDNA } from "./types.js";

export class DNARegistry {
  private manager: DNAManager;
  private catalog = new Map<string, DNACatalogEntry>();

  constructor(manager: DNAManager) {
    this.manager = manager;
  }

  register(dna: ChannelDNA): void {
    this.manager.create(dna);
    this.catalog.set(dna.metadata.id, {
      id: dna.metadata.id,
      name: dna.metadata.name,
      category: dna.metadata.category,
      description: dna.metadata.description,
      version: dna.metadata.version,
      tags: dna.metadata.tags,
      parentId: dna.metadata.parentId,
      createdAt: dna.metadata.createdAt,
      updatedAt: dna.metadata.updatedAt,
    });
  }

  unregister(id: string): void {
    this.manager.delete(id);
    this.catalog.delete(id);
  }

  search(query: string): DNACatalogEntry[] {
    const q = query.toLowerCase();
    return Array.from(this.catalog.values()).filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  filterByCategory(category: string): DNACatalogEntry[] {
    return Array.from(this.catalog.values()).filter(
      (e) => e.category.toLowerCase() === category.toLowerCase()
    );
  }

  list(): DNACatalogEntry[] {
    return Array.from(this.catalog.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  getCatalogEntry(id: string): DNACatalogEntry | undefined {
    return this.catalog.get(id);
  }
}

export interface DNACatalogEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  tags: string[];
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}
