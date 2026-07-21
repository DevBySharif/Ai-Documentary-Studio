import { LogLevel } from './types';
import { ILogger } from './interfaces';

export class Logger implements ILogger {
  log(level: LogLevel, category: string, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? JSON.stringify(meta) : '';
    console.log(`[${timestamp}] [${level}] [${category}] ${message} ${metaStr}`);
  }

  debug(category: string, message: string, meta?: any): void {
    this.log("Debug", category, message, meta);
  }

  info(category: string, message: string, meta?: any): void {
    this.log("Info", category, message, meta);
  }

  warn(category: string, message: string, meta?: any): void {
    this.log("Warning", category, message, meta);
  }

  error(category: string, message: string, meta?: any): void {
    this.log("Error", category, message, meta);
  }

  critical(category: string, message: string, meta?: any): void {
    this.log("Critical", category, message, meta);
  }
}
