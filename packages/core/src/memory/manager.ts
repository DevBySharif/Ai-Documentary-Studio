import type { MemoryEntry, MemoryQuery, MemoryResult, MemoryCategory, MemoryStore } from "./types.js";
import { ProjectMemoryStore } from "./project.js";
import { ImageMemoryStore, PromptMemoryStore, ImageReuseDetector } from "./image.js";
import { ConceptMemoryStore, SymbolMemoryStore } from "./concept.js";
import { CharacterMemoryStore } from "./character.js";
import { CameraMemoryStore, MotionMemoryStore } from "./camera.js";
import { StoryMemoryStore } from "./story.js";
import { SemanticMemoryStore } from "./semantic.js";
import { ImageSimilarityEngine } from "./similarity.js";
import { MemoryIndexer, MemoryExpiration, MemoryValidator } from "./indexer.js";
import { VisualContinuityEngine } from "./continuity.js";
import { ProductionMemoryGraph } from "./graph.js";

export interface MemoryStoreGroup {
  project: ProjectMemoryStore;
  image: ImageMemoryStore;
  prompt: PromptMemoryStore;
  concept: ConceptMemoryStore;
  symbol: SymbolMemoryStore;
  character: CharacterMemoryStore;
  camera: CameraMemoryStore;
  motion: MotionMemoryStore;
  story: StoryMemoryStore;
  semantic: SemanticMemoryStore;
}

export class MemoryManager {
  public stores: MemoryStoreGroup;
  public indexer: MemoryIndexer;
  public expiration: MemoryExpiration;
  public validator: MemoryValidator;
  public similarity: ImageSimilarityEngine;
  public continuity: VisualContinuityEngine;
  public graph: ProductionMemoryGraph;
  public reuseDetector: ImageReuseDetector;

  constructor() {
    this.stores = {
      project: new ProjectMemoryStore(),
      image: new ImageMemoryStore(),
      prompt: new PromptMemoryStore(),
      concept: new ConceptMemoryStore(),
      symbol: new SymbolMemoryStore(),
      character: new CharacterMemoryStore(),
      camera: new CameraMemoryStore(),
      motion: new MotionMemoryStore(),
      story: new StoryMemoryStore(),
      semantic: new SemanticMemoryStore(),
    };
    this.indexer = new MemoryIndexer();
    this.expiration = new MemoryExpiration();
    this.validator = new MemoryValidator();
    this.similarity = new ImageSimilarityEngine();
    this.continuity = new VisualContinuityEngine();
    this.graph = new ProductionMemoryGraph();
    this.reuseDetector = new ImageReuseDetector(this.stores.image);
  }

  query(q: MemoryQuery): MemoryResult {
    if (q.request === "FindImage" && q.concept) {
      const reuse = this.reuseDetector.shouldReuse(q.concept, q.threshold || 0.7);
      if (reuse.reuse && reuse.image) {
        this.stores.image.incrementReuse(reuse.image.imageId);
        return {
          found: true,
          entries: [this.toEntry(reuse.image)],
          confidence: reuse.image.similarityScore,
          message: `Reusing image ${reuse.image.imageId} for concept "${q.concept}"`,
        };
      }
      return { found: false, entries: [], confidence: 0, message: `No existing image for concept "${q.concept}"` };
    }

    if (q.request === "FindPrompt" && q.concept) {
      const best = this.stores.prompt.findBestForConcept(q.concept);
      if (best) {
        return {
          found: true,
          entries: [this.toEntry(best)],
          confidence: (best.promptScore + best.imageQuality) / 2,
          message: `Reusing prompt ${best.promptId} for concept "${q.concept}"`,
        };
      }
      return { found: false, entries: [], confidence: 0, message: `No existing prompt for concept "${q.concept}"` };
    }

    if (q.request === "FindSymbol" && q.concept) {
      const symbol = this.stores.symbol.getImageId(q.concept);
      if (symbol) {
        const img = this.stores.image.get(symbol);
        if (img) {
          return {
            found: true,
            entries: [this.toEntry(img)],
            confidence: 0.95,
            message: `Found symbol image ${symbol} for concept "${q.concept}"`,
          };
        }
      }
      return { found: false, entries: [], confidence: 0, message: `No symbol for concept "${q.concept}"` };
    }

    return { found: false, entries: [], confidence: 0, message: "No matching query handler" };
  }

  findImage(concept: string, threshold?: number): MemoryResult {
    return this.query({ request: "FindImage", concept, threshold });
  }

  findPrompt(concept: string): MemoryResult {
    return this.query({ request: "FindPrompt", concept });
  }

  findSymbol(concept: string): MemoryResult {
    return this.query({ request: "FindSymbol", concept });
  }

  save(entry: MemoryEntry): void {
    const validation = this.validator.validate(entry);
    if (!validation.valid) return;

    this.indexer.index(entry);

    if (entry.store === "image") {
      this.stores.image.add(entry.data as any);
    }
    if (entry.store === "prompt") {
      this.stores.prompt.add(entry.data as any);
    }
    if (entry.store === "concept") {
      this.stores.concept.add(entry.data as any);
    }
    if (entry.store === "symbol") {
      this.stores.symbol.add(entry.data as any);
    }
    if (entry.store === "character") {
      this.stores.character.add(entry.data as any);
    }

    this.graph.addNode(entry.id, entry.store, entry.tags[0] || entry.id, entry.data);
    for (const rel of entry.relationships) {
      this.graph.connect(entry.id, rel, 1, "related");
    }
  }

  forget(id: string): void {
    this.indexer.remove(id);
  }

  cleanup(maxAgeMs: number): void {
    const all = this.indexer.findByCategory("temporary");
    for (const entry of all) {
      const age = Date.now() - new Date(entry.createdAt).getTime();
      if (age > maxAgeMs) {
        this.forget(entry.id);
      }
    }
  }

  private toEntry(data: any): MemoryEntry {
    return {
      id: data.imageId || data.promptId || `entry_${Date.now()}`,
      store: "image",
      category: "project",
      tags: [data.concept || "unknown"],
      priority: 1,
      relationships: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data,
    };
  }
}
