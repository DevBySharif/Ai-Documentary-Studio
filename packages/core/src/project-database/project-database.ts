import { PDDatabaseEngine, PDSQLiteEngine } from "./database-engine";
import { PDDatabaseArchitecture } from "./database-architecture";
import { PDCoreEntities } from "./core-entities";
import { PDEntityRelationships } from "./entity-relationships";
import { PDUniqueIdentifiers } from "./unique-identifiers";
import { PDTransactionManagement } from "./transaction-management";
import { PDIndexingStrategy } from "./indexing-strategy";
import { PDFullTextSearch } from "./full-text-search";
import { PDVersionHistory } from "./version-history";
import { PDMigrationSystem } from "./migration-system";
import { PDBackupSystem } from "./backup-system";
import { PDRestoreSystem } from "./restore-system";
import { PDAuditLog } from "./audit-log";
import { PDPerformanceOptimization } from "./performance-optimization";
import { PDDataValidation } from "./data-validation";
import { PDDBOutputContractBuilder } from "./output-contract";
import { PDRepositoryLayer } from "./repository-layer";
import { PDQueryAnalyzer } from "./query-analyzer";
import { PDEventStore } from "./event-store";
import { PDDataRetentionPolicy } from "./data-retention-policy";
import { PDDatabaseHealthDashboard } from "./database-health-dashboard";

export class PDProjectDatabase {
  readonly engine: PDDatabaseEngine;
  readonly architecture: PDDatabaseArchitecture;
  readonly coreEntities: PDCoreEntities;
  readonly relationships: PDEntityRelationships;
  readonly identifiers: PDUniqueIdentifiers;
  readonly transactions: PDTransactionManagement;
  readonly indexing: PDIndexingStrategy;
  readonly fullTextSearch: PDFullTextSearch;
  readonly versionHistory: PDVersionHistory;
  readonly migrations: PDMigrationSystem;
  readonly backups: PDBackupSystem;
  readonly restore: PDRestoreSystem;
  readonly auditLog: PDAuditLog;
  readonly performance: PDPerformanceOptimization;
  readonly validation: PDDataValidation;
  readonly outputContract: PDDBOutputContractBuilder;
  readonly repository: PDRepositoryLayer;
  readonly queryAnalyzer: PDQueryAnalyzer;
  readonly eventStore: PDEventStore;
  readonly retentionPolicy: PDDataRetentionPolicy;
  readonly healthDashboard: PDDatabaseHealthDashboard;

  constructor() {
    this.engine = new PDSQLiteEngine();
    this.architecture = new PDDatabaseArchitecture();
    this.coreEntities = new PDCoreEntities();
    this.relationships = new PDEntityRelationships();
    this.identifiers = new PDUniqueIdentifiers();
    this.transactions = new PDTransactionManagement();
    this.indexing = new PDIndexingStrategy();
    this.fullTextSearch = new PDFullTextSearch();
    this.versionHistory = new PDVersionHistory();
    this.migrations = new PDMigrationSystem();
    this.backups = new PDBackupSystem();
    this.restore = new PDRestoreSystem(this.backups);
    this.auditLog = new PDAuditLog();
    this.performance = new PDPerformanceOptimization();
    this.validation = new PDDataValidation();
    this.outputContract = new PDDBOutputContractBuilder();
    this.repository = new PDRepositoryLayer(this.coreEntities, this.transactions);
    this.queryAnalyzer = new PDQueryAnalyzer();
    this.eventStore = new PDEventStore();
    this.retentionPolicy = new PDDataRetentionPolicy();
    this.healthDashboard = new PDDatabaseHealthDashboard(this.backups, this.migrations, this.queryAnalyzer);
  }
}
