export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  engine: string;
  projectId: string;
  action: string;
  message: string;
  data?: Record<string, unknown>;
  duration?: number;
}

export class Logger {
  private entries: LogEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries = 10000) {
    this.maxEntries = maxEntries;
  }

  info(engine: string, projectId: string, action: string, message: string, data?: Record<string, unknown>, duration?: number): void {
    this.addEntry("info", engine, projectId, action, message, data, duration);
  }

  warn(engine: string, projectId: string, action: string, message: string, data?: Record<string, unknown>, duration?: number): void {
    this.addEntry("warn", engine, projectId, action, message, data, duration);
  }

  error(engine: string, projectId: string, action: string, message: string, data?: Record<string, unknown>, duration?: number): void {
    this.addEntry("error", engine, projectId, action, message, data, duration);
  }

  debug(engine: string, projectId: string, action: string, message: string, data?: Record<string, unknown>, duration?: number): void {
    this.addEntry("debug", engine, projectId, action, message, data, duration);
  }

  getProjectLog(projectId: string): LogEntry[] {
    return this.entries
      .filter((e) => e.projectId === projectId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  getEngineLog(engine: string): LogEntry[] {
    return this.entries
      .filter((e) => e.engine === engine)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  getRecent(limit = 50): LogEntry[] {
    return this.entries.slice(-limit).reverse();
  }

  clear(): void {
    this.entries = [];
  }

  private addEntry(
    level: LogEntry["level"],
    engine: string,
    projectId: string,
    action: string,
    message: string,
    data?: Record<string, unknown>,
    duration?: number
  ): void {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      level,
      engine,
      projectId,
      action,
      message,
      data,
      duration,
    };

    this.entries.push(entry);

    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    if (level === "error") {
      console.error(`[${engine}] ${message}`, data ?? "");
    } else if (level === "warn") {
      console.warn(`[${engine}] ${message}`, data ?? "");
    } else {
      console.log(`[${engine}] ${message}`, data ?? "");
    }
  }
}
