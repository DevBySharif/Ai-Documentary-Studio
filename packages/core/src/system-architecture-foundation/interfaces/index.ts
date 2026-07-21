import { LogLevel } from '../types';

export interface IImageProvider {
  generateImage(prompt: string, resolution: string): Promise<string>;
}

export interface IVoiceProvider {
  generateVoice(text: string, voiceId: string): Promise<string>;
}

export interface IRenderEngine {
  renderTimeline(timelineId: string, outputFormat: string): Promise<string>;
}

export interface IStorage {
  saveFile(path: string, data: Buffer): Promise<void>;
  readFile(path: string): Promise<Buffer>;
}

export interface ILogger {
  log(level: LogLevel, category: string, message: string, meta?: any): void;
  debug(category: string, message: string, meta?: any): void;
  info(category: string, message: string, meta?: any): void;
  warn(category: string, message: string, meta?: any): void;
  error(category: string, message: string, meta?: any): void;
  critical(category: string, message: string, meta?: any): void;
}
