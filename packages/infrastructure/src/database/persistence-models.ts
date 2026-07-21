/**
 * SQLite persistence models — completely separate from Domain models.
 * snake_case column naming follows database conventions (AGENTS.md).
 */
export interface ProjectRecord {
  id: string;
  name: string;
  description: string;
  workspace_id: string;
  created_at: string; // ISO 8601
  updated_at: string;
  version: number;
}

export interface AssetRecord {
  id: string;
  name: string;
  file_path: string;
  mime_type: string;
  size_bytes: number;
  project_id: string;
  created_at: string;
}

export interface TimelineRecord {
  id: string;
  project_id: string;
  duration_ms: number;
  frame_rate: number;
  created_at: string;
  updated_at: string;
  version: number;
}
