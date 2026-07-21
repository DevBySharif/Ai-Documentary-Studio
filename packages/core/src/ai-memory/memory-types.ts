export type MemoryCategory =
  | "Project"
  | "Research"
  | "Conversation"
  | "Timeline"
  | "Asset"
  | "UserPreference"
  | "AiWorking"
  | "GlobalKnowledge";

export interface Citation {
  readonly sourceId: string;
  readonly documentRef: string;
  readonly timestamp?: Date;
  readonly confidence: number;
  readonly retrievalScore: number;
}

export interface ChunkInfo {
  readonly chunkId: string;
  readonly content: string;
  readonly tokenCount: number;
  readonly startIndex: number;
  readonly endIndex: number;
}

/**
 * Immutable Memory Item Model (IB Part 19 - Section 4, Section 20).
 * Updates create new versions, summaries, or relationships without mutating original entries.
 */
export interface MemoryItem {
  readonly id: string;
  readonly projectId?: string;
  readonly category: MemoryCategory;
  readonly title: string;
  readonly content: string;
  readonly version: number;
  readonly vector?: ReadonlyArray<number>;
  readonly citation?: Citation;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
