import type { DALogEntry, DALogLevel } from "./types.js";

export class DALogging {
  private entries: DALogEntry[] = [];
  private readonly maxEntries = 10000;

  log(level: DALogLevel, category: string, message: string, data?: Record<string, unknown>): void {
    this.entries.push({ timestamp: Date.now(), level, category, message, data });
    if (this.entries.length > this.maxEntries) this.entries.shift();
  }

  debug(category: string, message: string, data?: Record<string, unknown>): void {
    this.log("debug", category, message, data);
  }

  info(category: string, message: string, data?: Record<string, unknown>): void {
    this.log("info", category, message, data);
  }

  warning(category: string, message: string, data?: Record<string, unknown>): void {
    this.log("warning", category, message, data);
  }

  error(category: string, message: string, data?: Record<string, unknown>): void {
    this.log("error", category, message, data);
  }

  critical(category: string, message: string, data?: Record<string, unknown>): void {
    this.log("critical", category, message, data);
  }

  getByLevel(level: DALogLevel): DALogEntry[] {
    return this.entries.filter((e) => e.level === level);
  }

  getByCategory(category: string): DALogEntry[] {
    return this.entries.filter((e) => e.category === category);
  }

  getAll(): DALogEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }
}
