import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

export class ASSettingsImportExport {
  private settings: Record<string, unknown> = {};

  constructor(settings?: Record<string, unknown>) {
    if (settings) {
      this.settings = this.clone(settings);
    }
  }

  exportToJSON(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  importFromJSON(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return false;
      }
      this.settings = this.clone(parsed as Record<string, unknown>);
      return true;
    } catch {
      return false;
    }
  }

  exportEncrypted(password: string): string {
    const json = JSON.stringify(this.settings);
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(json, 'utf-8'), cipher.final()]);
    const payload = {
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      data: encrypted.toString('base64'),
    };
    return JSON.stringify(payload);
  }

  importEncrypted(data: string, password: string): boolean {
    try {
      const payload = JSON.parse(data);
      const salt = Buffer.from(payload.salt, 'base64');
      const iv = Buffer.from(payload.iv, 'base64');
      const encrypted = Buffer.from(payload.data, 'base64');
      const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
      const json = decrypted.toString('utf-8');
      return this.importFromJSON(json);
    } catch {
      return false;
    }
  }

  backupSettings(): string {
    const backup = {
      timestamp: Date.now(),
      version: 1,
      data: this.clone(this.settings),
    };
    return JSON.stringify(backup, null, 2);
  }

  restoreProfile(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      const profileData = parsed.data || parsed;
      if (typeof profileData !== 'object' || profileData === null) {
        return false;
      }
      this.settings = this.clone(profileData as Record<string, unknown>);
      return true;
    } catch {
      return false;
    }
  }

  setSettings(settings: Record<string, unknown>): void {
    this.settings = this.clone(settings);
  }

  getSettings(): Record<string, unknown> {
    return this.clone(this.settings);
  }

  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
