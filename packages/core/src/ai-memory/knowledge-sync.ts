import { MemoryItem } from "./memory-types";
import { EmbeddingProvider } from "./embedding-pipeline";
import { VectorStore } from "./vector-store";

/**
 * Knowledge Synchronization Engine (IB Part 19 - Section 24).
 * Keeps knowledge sources synchronized with project, script, and timeline changes.
 */
export class KnowledgeSyncEngine {
  constructor(
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly vectorStore: VectorStore
  ) {}

  public async syncDocument(
    id: string,
    projectId: string,
    title: string,
    content: string
  ): Promise<MemoryItem> {
    const vector = await this.embeddingProvider.embed(content);

    const item: MemoryItem = {
      id,
      projectId,
      category: "Project",
      title,
      content,
      version: Date.now(),
      vector,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.vectorStore.insert(item);
    return item;
  }
}
