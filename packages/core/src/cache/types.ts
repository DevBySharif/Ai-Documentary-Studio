export type CacheCategory =
  | "compiled_dna"
  | "prompt_template"
  | "image_metadata"
  | "whisper_result"
  | "motion_preset"
  | "narrative_blueprint"
  | "project_manifest";

export interface CacheEntry<T = unknown> {
  key: string;
  category: CacheCategory;
  value: T;
  createdAt: string;
  expiresAt: string;
  accessCount: number;
}

export interface CacheConfig {
  defaultTTLMs: number;
  maxEntries: number;
}
