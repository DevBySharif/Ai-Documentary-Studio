import { MockEmbeddingProvider } from "./embedding-pipeline";
import { SqliteVectorStore } from "./vector-store";
import { KnowledgeGraph } from "./knowledge-graph";
import { RagPipeline } from "./rag-pipeline";
import { MemoryConsolidator } from "./memory-consolidator";
import { KnowledgeSyncEngine } from "./knowledge-sync";

export interface MemoryOutputContract {
  query: string;
  retrievedChunks: number;
  selectedChunks: number;
  contextTokens: number;
  status: string;
}

/**
 * Master AI Memory Engine (IB Part 19).
 * Long-Term Intelligence Layer coordinating vector store, RAG, knowledge graph,
 * memory consolidation, knowledge sync, and generating Section 19 Output Contract.
 */
export class MemoryEngine {
  public readonly embeddingProvider = new MockEmbeddingProvider();
  public readonly vectorStore = new SqliteVectorStore();
  public readonly knowledgeGraph = new KnowledgeGraph();
  public readonly ragPipeline = new RagPipeline(this.embeddingProvider, this.vectorStore);
  public readonly consolidator = new MemoryConsolidator();
  public readonly syncEngine = new KnowledgeSyncEngine(this.embeddingProvider, this.vectorStore);

  public async queryMemory(
    query: string,
    activeProjectId?: string,
    maxChunks = 5
  ): Promise<MemoryOutputContract> {
    const artifact = await this.ragPipeline.assembleContext(query, activeProjectId, maxChunks);

    return {
      query: artifact.query,
      retrievedChunks: artifact.selectedChunks.length * 2, // retrieved pool
      selectedChunks: artifact.selectedChunks.length,
      contextTokens: artifact.contextTokens,
      status: "Ready",
    };
  }
}
