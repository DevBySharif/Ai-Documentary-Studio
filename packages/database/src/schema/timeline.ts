import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { projects } from './project';
import { assets } from './asset';

export const timelineTracks = sqliteTable('timeline_tracks', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // VIDEO, AUDIO, SUBTITLE
  orderIndex: integer('order_index').notNull(),
  locked: integer('locked', { mode: 'boolean' }).notNull().default(false),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const timelineClips = sqliteTable('timeline_clips', {
  id: text('id').primaryKey(),
  trackId: text('track_id').references(() => timelineTracks.id, { onDelete: 'cascade' }),
  assetId: text('asset_id').references(() => assets.id, { onDelete: 'cascade' }),
  startTimeMs: integer('start_time_ms').notNull(),
  durationMs: integer('duration_ms').notNull(),
  startOffsetMs: integer('start_offset_ms').notNull().default(0), // for trimming
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});
