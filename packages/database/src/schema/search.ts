import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Represents an FTS5 virtual table.
// In actual SQLite this will be created via a custom migration script using:
// CREATE VIRTUAL TABLE fts_search USING fts5(id, title, content, type);
export const ftsSearch = sqliteTable('fts_search', {
  id: text('id').primaryKey(),
  title: text('title'),
  content: text('content'),
  type: text('type'), // PROJECT, SCENE, PROMPT
});
