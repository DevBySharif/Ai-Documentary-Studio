/**
 * Centralized GPU Resource Management (IB Part 15 - Section 22).
 * Responsible for texture pooling, buffer reuse, shader caching, and memory budgeting.
 */
export interface GpuTexture {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly format: string;
  readonly sizeBytes: number;
  inUse: boolean;
}

export class GpuResourceManager {
  private texturePool: GpuTexture[] = [];
  private shaderCache = new Map<string, string>();
  private usedMemoryBytes = 0;
  private maxMemoryBytes: number;

  constructor(maxMemoryMb = 1024) {
    this.maxMemoryBytes = maxMemoryMb * 1024 * 1024;
  }

  public setMemoryBudgetMb(maxMemoryMb: number): void {
    this.maxMemoryBytes = maxMemoryMb * 1024 * 1024;
    this.trimPoolIfNeeded();
  }

  public acquireTexture(width: number, height: number, format = "rgba8"): GpuTexture {
    const sizeBytes = width * height * 4;
    const pooled = this.texturePool.find(
      (t) => !t.inUse && t.width === width && t.height === height && t.format === format
    );

    if (pooled) {
      pooled.inUse = true;
      return pooled;
    }

    const newTexture: GpuTexture = {
      id: `tex_${Math.random().toString(36).substring(2, 9)}`,
      width,
      height,
      format,
      sizeBytes,
      inUse: true,
    };

    this.texturePool.push(newTexture);
    this.usedMemoryBytes += sizeBytes;
    this.trimPoolIfNeeded();

    return newTexture;
  }

  public releaseTexture(textureId: string): void {
    const tex = this.texturePool.find((t) => t.id === textureId);
    if (tex) {
      tex.inUse = false;
    }
  }

  public getShader(shaderName: string, compiledSourceSupplier: () => string): string {
    if (!this.shaderCache.has(shaderName)) {
      this.shaderCache.set(shaderName, compiledSourceSupplier());
    }
    return this.shaderCache.get(shaderName)!;
  }

  public getUsedMemoryMb(): number {
    return Math.round(this.usedMemoryBytes / (1024 * 1024));
  }

  private trimPoolIfNeeded(): void {
    while (this.usedMemoryBytes > this.maxMemoryBytes) {
      const unusedIndex = this.texturePool.findIndex((t) => !t.inUse);
      if (unusedIndex === -1) break; // All in use, cannot trim further

      const [removed] = this.texturePool.splice(unusedIndex, 1);
      this.usedMemoryBytes -= removed.sizeBytes;
    }
  }

  public clear(): void {
    this.texturePool = [];
    this.shaderCache.clear();
    this.usedMemoryBytes = 0;
  }
}
