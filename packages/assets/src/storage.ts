import * as fs from 'fs/promises';
import * as path from 'path';

export interface IStorageProvider {
  store(key: string, buffer: Buffer): Promise<void>;
  retrieve(key: string): Promise<Buffer>;
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<void>;
}

export class LocalFileSystemProvider implements IStorageProvider {
  constructor(private baseDir: string) {}

  private getAbsolutePath(key: string): string {
    return path.join(this.baseDir, key);
  }

  async store(key: string, buffer: Buffer): Promise<void> {
    const fullPath = this.getAbsolutePath(key);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);
  }

  async retrieve(key: string): Promise<Buffer> {
    const fullPath = this.getAbsolutePath(key);
    return await fs.readFile(fullPath);
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.getAbsolutePath(key));
      return true;
    } catch {
      return false;
    }
  }

  async delete(key: string): Promise<void> {
    const fullPath = this.getAbsolutePath(key);
    if (await this.exists(key)) {
      await fs.unlink(fullPath);
    }
  }
}
