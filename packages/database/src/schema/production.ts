import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { scenes } from './project';
import { assets } from './asset';

export const prompts = sqliteTable('prompts', {
  id: text('id').primaryKey(),
  sceneId: text('scene_id').references(() => scenes.id, { onDelete: 'cascade' }),
  promptType: text('prompt_type').notNull(),
  version: integer('version').notNull().default(1),
  promptText: text('prompt_text').notNull(),
  provider: text('provider').notNull(),
  status: text('status').notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const images = sqliteTable('images', {
  id: text('id').primaryKey(),
  promptId: text('prompt_id').references(() => prompts.id, { onDelete: 'cascade' }),
  assetId: text('asset_id').references(() => assets.id, { onDelete: 'cascade' }),
  seed: text('seed'),
  provider: text('provider').notNull(),
  generationTimeMs: integer('generation_time_ms').notNull(),
  approvalStatus: text('approval_status').notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const voices = sqliteTable('voices', {
  id: text('id').primaryKey(),
  promptId: text('prompt_id').references(() => prompts.id, { onDelete: 'cascade' }),
  assetId: text('asset_id').references(() => assets.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  speaker: text('speaker').notNull(),
  language: text('language').notNull(),
  durationMs: integer('duration_ms').notNull(),
  transcript: text('transcript').notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});
