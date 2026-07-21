export type UpdateType = 
  | "Application" 
  | "Security" 
  | "Plugin" 
  | "AIProvider" 
  | "ImageProvider" 
  | "VoiceProvider" 
  | "ChannelDNA" 
  | "MotionPreset" 
  | "ExportProfile" 
  | "AIPromptPack"
  | "Component";

export type ReleaseChannel = "Stable" | "Beta" | "Developer" | "Nightly" | "LTS";

export type UpdateStatus = 
  | "Checking" 
  | "Available" 
  | "Downloading" 
  | "Validating" 
  | "BackingUp" 
  | "Installing" 
  | "Migrating" 
  | "Verifying" 
  | "Ready" 
  | "Failed" 
  | "RolledBack";

export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  build: string;
  channel: ReleaseChannel;
}

export interface UpdatePackage {
  id: string;
  type: UpdateType;
  version: VersionInfo;
  downloadUrl: string;
  checksum: string;
  sizeBytes: number;
  isIncremental: boolean;
  requiresRestart: boolean;
  releaseNotesId?: string;
  dependencies: Record<string, string>; // e.g. "databaseSchema": ">=5.0.0"
}

export interface CompatibilityReport {
  isCompatible: boolean;
  diskSpace: { required: number; available: number; passed: boolean };
  database: { compatible: boolean; requiresMigration: boolean };
  plugins: { incompatibleCount: number; list: string[] };
  projectIntegrity: { passed: boolean; issues: string[] };
  backup: { available: boolean; lastBackup?: string };
}

export interface UpdateOutputContract {
  currentVersion: string;
  availableVersion?: string;
  status: UpdateStatus;
  backup: string;
}

export interface ReleaseNote {
  id: string;
  version: string;
  date: string;
  features: string[];
  bugFixes: string[];
  performance: string[];
  breakingChanges: string[];
  migrationNotes: string[];
  securityUpdates: string[];
}
