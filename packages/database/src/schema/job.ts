import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { projects } from './project';

export const renderJobs = sqliteTable('render_jobs', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  queuePosition: integer('queue_position').notNull(),
  status: text('status').notNull(),
  progress: real('progress').notNull().default(0),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  checkpoint: text('checkpoint', { mode: 'json' }),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const exportJobs = sqliteTable('export_jobs', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  exportPreset: text('export_preset').notNull(),
  codec: text('codec').notNull(),
  resolution: text('resolution').notNull(),
  outputPath: text('output_path').notNull(),
  status: text('status').notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});
