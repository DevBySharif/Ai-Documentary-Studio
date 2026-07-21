# SRS Volume 04 Part 08 — Project Database

## Overview
The Project Database stores and manages all persistent production data: projects, assets, Channel DNA, production history, settings, analytics, and workflow state. Supports fast querying, versioning, transactional integrity, and future migration.

## Database Engine
Default: SQLite (in-memory). Future: PostgreSQL, MySQL, SQL Server. Business logic remains database-independent.

## Sub-Modules

### Database Architecture
Application→Repository Layer→ORM/Query Layer→Database Engine→Storage. No raw SQL.

### Core Entities
19 entity types: workspace, project, channel, channel_dna, script, prompt, scene, image, audio, timeline, motion, effect, subtitle, qa_report, export, asset, user, plugin, setting.

### Entity Relationships
Workspace→Project→Scenes→Assets→Render→Export. Stable UUIDs for all relationships.

### Unique Identifiers
UUID generation and validation. Timestamp and version tracking per record.

### Transaction Management
Atomic operations with begin/commit/rollback. Critical: project creation, scene approval, export, asset versioning, migration.

### Indexing Strategy
BTREE/HASH/FULLTEXT/GIN/GIST indexes. Index recommendations. Usage statistics.

### Full-Text Search
Search across scripts, prompts, notes, QA reports, metadata. Scoring and snippet generation.

### Version History
Per-entity versioning with diff comparison. All older versions remain queryable.

### Migration System
Schema migrations with apply/rollback. Checksum validation. Pending/applied migration tracking.

### Backup System
Automatic, manual, scheduled, pre-upgrade backups. Retention configuration.

### Restore System
Restore workspace, project, table, or point-in-time. Integrity validation before restore.

### Audit Log
Immutable audit entries for project changes, DNA updates, asset creation, export history, QA approvals.

### Performance Optimization
Prepared statements, batch inserts, lazy loading, connection pooling, query caching, background indexing.

### Data Validation
Foreign key, required fields, version compatibility, relationship integrity checks before commit.

### Repository Layer
CRUD abstraction between application and database. Query, transaction, and validation coordination.

### Query Analyzer
Monitor slow queries, missing indexes, lock contention, database growth, cache hit rate. Auto-recommend optimizations.

### Event Store
Records production events separately: Scene Approved, Voice Generated, QA Passed, Export Completed, DNA Updated. Supports analytics and debugging.

### Data Retention Policy
Configurable retention for temp cache, autosave history, render cache, audit logs, analytics, archived projects.

### Database Health Dashboard
Real-time metrics: database size, table growth, fragmentation, index usage, backup status, migration status. Maintenance recommendations.

## Orchestrator
`PDProjectDatabase` composes all 22 sub-modules.
