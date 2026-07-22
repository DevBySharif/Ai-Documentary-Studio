import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dbFilePath = process.env.DATABASE_URL || path.resolve(process.cwd(), 'studio.db.json');

export interface ProjectRecord {
  id: string;
  workspaceId?: string | null;
  channelDnaId?: string | null;
  title: string;
  description?: string | null;
  productionStatus: string;
  qaStatus: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface AssetRecord {
  id: string;
  projectId: string;
  type: string;
  filePath: string;
  hash: string;
  resolution?: string | null;
  durationMs?: number | null;
  fileSizeBytes: number;
  createdAt: string;
  deletedAt?: string | null;
}

export interface TimelineTrackRecord {
  id: string;
  projectId: string;
  type: string;
  orderIndex: number;
  locked: boolean;
  deletedAt?: string | null;
}

export interface TimelineClipRecord {
  id: string;
  trackId: string;
  assetId: string;
  startTimeMs: number;
  durationMs: number;
  startOffsetMs: number;
  deletedAt?: string | null;
}

export interface DbSchema {
  projects: ProjectRecord[];
  assets: AssetRecord[];
  timeline_tracks: TimelineTrackRecord[];
  timeline_clips: TimelineClipRecord[];
}

function loadDatabase(): DbSchema {
  try {
    if (fs.existsSync(dbFilePath)) {
      const content = fs.readFileSync(dbFilePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Failed to parse database file, reinitializing', e);
  }
  const defaultDb: DbSchema = {
    projects: [],
    assets: [],
    timeline_tracks: [],
    timeline_clips: []
  };
  saveDatabase(defaultDb);
  return defaultDb;
}

function saveDatabase(data: DbSchema) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export const dbStore = {
  getProjects(): ProjectRecord[] {
    const data = loadDatabase();
    return data.projects.filter(p => !p.deletedAt);
  },

  getProjectById(id: string): ProjectRecord | undefined {
    const data = loadDatabase();
    return data.projects.find(p => p.id === id && !p.deletedAt);
  },

  createProject(title: string, description?: string, productionStatus?: string, qaStatus?: string): ProjectRecord {
    const data = loadDatabase();
    const now = new Date().toISOString();
    const newProject: ProjectRecord = {
      id: crypto.randomUUID(),
      title,
      description: description || '',
      productionStatus: productionStatus || 'draft',
      qaStatus: qaStatus || 'pending',
      version: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };
    data.projects.push(newProject);
    saveDatabase(data);
    return newProject;
  },

  updateProject(id: string, updates: Partial<ProjectRecord>): ProjectRecord | undefined {
    const data = loadDatabase();
    const index = data.projects.findIndex(p => p.id === id && !p.deletedAt);
    if (index === -1) return undefined;

    const existing = data.projects[index];
    const updated: ProjectRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    data.projects[index] = updated;
    saveDatabase(data);
    return updated;
  },

  deleteProject(id: string): boolean {
    const data = loadDatabase();
    const index = data.projects.findIndex(p => p.id === id && !p.deletedAt);
    if (index === -1) return false;

    data.projects.splice(index, 1);
    saveDatabase(data);
    return true;
  }
};

export const db = dbStore;
