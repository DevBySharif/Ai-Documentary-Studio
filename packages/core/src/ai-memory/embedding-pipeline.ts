import { ChunkInfo } from "./memory-types";

export interface EmbeddingProvider {
  embed(text: string): Promise<ReadonlyArray<number>>;
  embedBatch(texts: ReadonlyArray<string>): Promise<ReadonlyArray<ReadonlyArray<number>>>;
}

export class MockEmbeddingProvider implements EmbeddingProvider {
  public async embed(text: string): Promise<ReadonlyArray<number>> {
    // Generate deterministic 64-dimensional pseudo-embedding vector for testing
    const vec = new Float32Array(64);
    for (let i = 0; i < 64; i++) {
      vec[i] = (text.charCodeAt(i % text.length) || 0) / 255.0;
    }
    return Array.from(vec);
  }

  public async embedBatch(texts: ReadonlyArray<string>): Promise<ReadonlyArray<ReadonlyArray<number>>> {
    return Promise.all(texts.map((t) => this.embed(t)));
  }
}

/**
 * Semantic Chunker (IB Part 19 - Section 10).
 * Splits text into meaningful chunks based on paragraphs & semantic boundaries.
 */
export class SemanticChunker {
  public chunkText(text: string, targetTokensPerChunk = 256): ReadonlyArray<ChunkInfo> {
    const paragraphs = text.split(/\n\s*\n/);
    const chunks: ChunkInfo[] = [];

    let currentChunkText = "";
    let startIndex = 0;

    for (const para of paragraphs) {
      if ((currentChunkText + para).length / 4 > targetTokensPerChunk && currentChunkText.length > 0) {
        chunks.push({
          chunkId: `chk_${Math.random().toString(36).substring(2, 9)}`,
          content: currentChunkText.trim(),
          tokenCount: Math.ceil(currentChunkText.length / 4),
          startIndex,
          endIndex: startIndex + currentChunkText.length,
        });
        startIndex += currentChunkText.length;
        currentChunkText = "";
      }
      currentChunkText += para + "\n\n";
    }

    if (currentChunkText.trim().length > 0) {
      chunks.push({
        chunkId: `chk_${Math.random().toString(36).substring(2, 9)}`,
        content: currentChunkText.trim(),
        tokenCount: Math.ceil(currentChunkText.length / 4),
        startIndex,
        endIndex: startIndex + currentChunkText.length,
      });
    }

    return chunks;
  }
}
