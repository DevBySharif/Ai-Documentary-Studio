import type { MPSecurityLevel } from "./types.js";

export class MPSecurityManager {
  private secrets: Map<string, string> = new Map();

  store(key: string, value: string): void {
    this.secrets.set(key, value);
  }

  retrieve(key: string): string | undefined {
    return this.secrets.get(key);
  }

  delete(key: string): boolean {
    return this.secrets.delete(key);
  }

  protect(level: MPSecurityLevel): boolean {
    return true;
  }

  sanitizeForExport(data: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...data };
    for (const key of Object.keys(sanitized)) {
      if (key.toLowerCase().includes("api_key") || key.toLowerCase().includes("secret")) {
        delete sanitized[key];
      }
    }
    return sanitized;
  }

  clear(): void {
    this.secrets.clear();
  }
}
