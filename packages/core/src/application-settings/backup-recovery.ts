import * as crypto from 'crypto';

export interface ASBackupRecoveryData {
  autoBackup: boolean;
  backupFrequency: number;
  backupLocation: string;
  snapshotCount: number;
  crashRecovery: boolean;
}

export interface ASBackupEntry {
  id: string;
  timestamp: number;
  label: string;
  size: number;
  data: string;
}

const DEFAULTS: ASBackupRecoveryData = {
  autoBackup: true,
  backupFrequency: 600,
  backupLocation: '.backups',
  snapshotCount: 10,
  crashRecovery: true,
};

export class ASBackupRecovery {
  private settings: ASBackupRecoveryData;
  private backups: ASBackupEntry[] = [];

  constructor() {
    this.settings = this.clone(DEFAULTS);
  }

  set<K extends keyof ASBackupRecoveryData>(key: K, value: ASBackupRecoveryData[K]): void {
    this.settings[key] = value;
  }

  get<K extends keyof ASBackupRecoveryData>(key: K): ASBackupRecoveryData[K] {
    return this.settings[key];
  }

  getDefaults(): ASBackupRecoveryData {
    return this.clone(DEFAULTS);
  }

  getAll(): ASBackupRecoveryData {
    return this.clone(this.settings);
  }

  createBackup(label?: string): string {
    const id = crypto.randomUUID();
    const entry: ASBackupEntry = {
      id,
      timestamp: Date.now(),
      label: label || `backup-${new Date().toISOString()}`,
      size: 0,
      data: JSON.stringify(this.settings),
    };
    entry.size = Buffer.byteLength(entry.data, 'utf-8');
    this.backups.push(entry);

    const maxSnapshots = this.settings.snapshotCount;
    if (this.backups.length > maxSnapshots) {
      this.backups = this.backups.slice(this.backups.length - maxSnapshots);
    }

    return id;
  }

  getBackups(): ASBackupEntry[] {
    return this.backups
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getBackup(id: string): ASBackupEntry | undefined {
    return this.backups.find((b) => b.id === id);
  }

  restoreFromBackup(backupId: string): boolean {
    const backup = this.backups.find((b) => b.id === backupId);
    if (!backup) return false;
    try {
      const data = JSON.parse(backup.data) as ASBackupRecoveryData;
      this.settings = this.clone(data);
      return true;
    } catch {
      return false;
    }
  }

  deleteBackup(backupId: string): boolean {
    const index = this.backups.findIndex((b) => b.id === backupId);
    if (index === -1) return false;
    this.backups.splice(index, 1);
    return true;
  }

  clearBackups(): void {
    this.backups = [];
  }

  resetToDefaults(): void {
    this.settings = this.clone(DEFAULTS);
  }

  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
