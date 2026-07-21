import { MemoryItem } from "./memory-types";
import { EmbeddingProvider } from "./embedding-pipeline";
import { VectorStore } from "./vector-store";
import { ContextRanker, RankedContextItem } from "./context-ranker";

export interface CompiledContextArtifact {
  readonly query: string;
  readonly selectedChunks: ReadonlyArray<RankedContextItem>;
  readonly contextTokens: number;
  readonly assembledPromptText: string;
}

/**
 * Retrieval-Augmented Generation (RAG) Pipeline (IB Part 19 - Section 12, Section 23).
 * Assembles dynamic, transient context artifacts for AI tasks.
 */
export class RagPipeline {
  private ranker = new ContextRanker();

  constructor(
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly vectorStore: VectorStore
  ) {}

  public async assembleContext(
    query: string,
    activeProjectId?: string,
    maxChunks = 5
  ): Promise<CompiledContextArtifact> {
    const queryVec = await this.embeddingProvider.embed(query);
    const rawResults = await this.vectorStore.search(queryVec, maxChunks * 2);
    const selected = this.ranker.rank(rawResults, activeProjectId, maxChunks);

    let contextTokens = 0;
    const promptParts: string[] = [];

    for (const item of selected) {
      const tokens = Math.ceil(item.item.content.length / 4);
      contextTokens += tokens;
      promptParts.push(`[Source: ${item.item.title} (Score: ${item.finalScore})]\n${item.item.content}`);
    }

    return {
      query,
      selectedChunks: selected,
      contextTokens,
      assembledPromptText: promptParts.join("\n\n"),
    };
  }
}
