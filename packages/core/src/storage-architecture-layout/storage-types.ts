export type StorageLayerType =
  | "ApplicationStorage"
  | "ProjectStorage"
  | "CacheStorage"
  | "TemporaryStorage"
  | "BackupStorage"
  | "ExportStorage";

export interface ProjectFolderDescriptor {
  readonly rootPath: string;
  readonly databaseDir: string;
  readonly researchDir: string;
  readonly scriptsDir: string;
  readonly storyboardDir: string;
  readonly promptsDir: string;
  readonly assetsDir: string;
  readonly voiceDir: string;
  readonly timelineDir: string;
  readonly reviewDir: string;
  readonly exportsDir: string;
  readonly backupsDir: string;
  readonly logsDir: string;
  readonly cacheDir: string;
  readonly tempDir: string;
}

export interface StorageCleanupPolicy {
  readonly isAutoCleanupCacheEnabled: boolean;
  readonly isAutoCleanupTempEnabled: boolean;
  readonly maxCacheAgeDays: number;
  readonly neverDeleteOriginalAssets: boolean;
  readonly neverDeleteDatabases: boolean;
}

export interface FileIntegrityCheckResult {
  readonly isIntegrityValid: boolean;
  readonly missingFilesCount: number;
  readonly corruptedFilesCount: number;
  readonly brokenReferencesCount: number;
  readonly missingPaths: ReadonlyArray<string>;
}

export interface ProjectPackageConfig {
  readonly includeCache: boolean;
  readonly includeProxies: boolean;
  readonly compressLevel: "Fast" | "Standard" | "Maximum";
}
