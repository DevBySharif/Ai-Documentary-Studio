import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const providers = sqliteTable('providers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // AI, TTS, IMAGE, VIDEO
  apiKeyRef: text('api_key_ref'),
  status: text('status').notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const plugins = sqliteTable('plugins', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  version: text('version').notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const qaReports = sqliteTable('qa_reports', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  status: text('status').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const analyticsEvents = sqliteTable('analytics_events', {
  id: text('id').primaryKey(),
  eventName: text('event_name').notNull(),
  payload: text('payload', { mode: 'json' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  operation: text('operation').notNull(), // CREATE, UPDATE, DELETE
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  previousValues: text('previous_values', { mode: 'json' }),
  newValues: text('new_values', { mode: 'json' }),
  source: text('source').notNull()
});
