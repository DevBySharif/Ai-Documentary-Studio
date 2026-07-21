import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { workspaces } from './workspace';

export const channelDna = sqliteTable('channel_dna', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
  version: integer('version').notNull().default(1),
  narrativeRules: text('narrative_rules', { mode: 'json' }).notNull(),
  promptRules: text('prompt_rules', { mode: 'json' }).notNull(),
  motionRules: text('motion_rules', { mode: 'json' }).notNull(),
  styleRules: text('style_rules', { mode: 'json' }).notNull(),
  qaRules: text('qa_rules', { mode: 'json' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
  channelDnaId: text('channel_dna_id').references(() => channelDna.id),
  title: text('title').notNull(),
  description: text('description'),
  productionStatus: text('production_status').notNull(),
  qaStatus: text('qa_status').notNull(),
  version: integer('version').notNull().default(1),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const scenes = sqliteTable('scenes', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  sceneNumber: integer('scene_number').notNull(),
  title: text('title').notNull(),
  script: text('script').notNull(),
  summary: text('summary'),
  status: text('status').notNull(),
  orderIndex: integer('order_index').notNull(),
  durationEstimateMs: integer('duration_estimate_ms').notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});
