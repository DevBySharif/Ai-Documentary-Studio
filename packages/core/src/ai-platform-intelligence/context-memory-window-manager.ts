import { AiMemoryLevel, ContextWindowConfig } from "./ai-platform-types";

/**
 * Context Builder & 3-Tier Memory Manager (Vol 07 Part 01 - Section 11, Section 12, Section 13).
 * Manages Task Memory, Project Memory, and Global Memory while applying relevance ranking & context window compression.
 */
export class ContextMemoryWindowManager {
  private taskMemory = new Map<string, string>();
  private projectMemory = new Map<string, string>();
  private globalMemory = new Map<string, string>();

  private config: ContextWindowConfig = {
    maxTokenLimit: 128000,
    relevanceThreshold: 0.75,
    enableCompression: true,
    enableHistoricalSummarization: true,
  };

  public storeMemory(level: AiMemoryLevel, key: string, content: string): void {
    if (level === "TaskMemory") this.taskMemory.set(key, content);
    else if (level === "ProjectMemory") this.projectMemory.set(key, content);
    else this.globalMemory.set(key, content);
  }

  public assembleOptimalContext(rawContextText: string): { finalContextText: string; isCompressed: boolean; tokenEstimate: number } {
    let text = rawContextText;
    let compressed = false;

    // Simulate relevance ranking & historical compression if context is large
    if (text.length > 20000 && this.config.enableCompression) {
      text = `[COMPRESSED HISTORICAL SUMMARY]\n${text.substring(0, 5000)}\n...[RELEVANT CONTEXT ONLY]...\n${text.substring(text.length - 5000)}`;
      compressed = true;
    }

    return {
      finalContextText: text,
      isCompressed: compressed,
      tokenEstimate: Math.ceil(text.length / 4),
    };
  }
}
