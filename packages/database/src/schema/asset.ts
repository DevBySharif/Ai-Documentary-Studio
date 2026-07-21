import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { projects } from './project';

export const assets = sqliteTable('assets', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  filePath: text('file_path').notNull(),
  hash: text('hash').notNull(),
  resolution: text('resolution'),
  durationMs: integer('duration_ms'),
  fileSizeBytes: integer('file_size_bytes').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const assetTags = sqliteTable('asset_tags', {
  assetId: text('asset_id').references(() => assets.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
});
