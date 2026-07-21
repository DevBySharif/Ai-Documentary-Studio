import type { GRGPUUsage } from "./types.js";

export class GRGPUMemoryManager {
  private textureMemoryMB = 0;
  private frameBuffersMB = 0;
  private shaderCacheMB = 0;
  private tempBuffersMB = 0;
  private renderTargetsMB = 0;
  private maxMemoryMB = 2048;

  configure(maxMB: number): void {
    this.maxMemoryMB = maxMB;
  }

  allocateTexture(sizeMB: number): boolean {
    if (this.getTotalUsed() + sizeMB > this.maxMemoryMB) return false;
    this.textureMemoryMB += sizeMB;
    return true;
  }

  allocateFrameBuffer(sizeMB: number): boolean {
    if (this.getTotalUsed() + sizeMB > this.maxMemoryMB) return false;
    this.frameBuffersMB += sizeMB;
    return true;
  }

  allocateShaderCache(sizeMB: number): void {
    this.shaderCacheMB += sizeMB;
  }

  allocateTempBuffer(sizeMB: number): boolean {
    if (this.getTotalUsed() + sizeMB > this.maxMemoryMB) return false;
    this.tempBuffersMB += sizeMB;
    return true;
  }

  allocateRenderTarget(sizeMB: number): boolean {
    if (this.getTotalUsed() + sizeMB > this.maxMemoryMB) return false;
    this.renderTargetsMB += sizeMB;
    return true;
  }

  freeTexture(sizeMB: number): void {
    this.textureMemoryMB = Math.max(0, this.textureMemoryMB - sizeMB);
  }

  freeFrameBuffer(sizeMB: number): void {
    this.frameBuffersMB = Math.max(0, this.frameBuffersMB - sizeMB);
  }

  freeAll(): void {
    this.textureMemoryMB = 0;
    this.frameBuffersMB = 0;
    this.shaderCacheMB = 0;
    this.tempBuffersMB = 0;
    this.renderTargetsMB = 0;
  }

  getTotalUsed(): number {
    return this.textureMemoryMB + this.frameBuffersMB + this.shaderCacheMB + this.tempBuffersMB + this.renderTargetsMB;
  }

  getUsagePercent(): number {
    return (this.getTotalUsed() / this.maxMemoryMB) * 100;
  }

  getUsage(): GRGPUUsage {
    if (this.getTotalUsed() === 0) return "idle";
    if (this.getUsagePercent() > 80) return "rendering";
    if (this.textureMemoryMB > 100) return "loading";
    return "idle";
  }

  hasAvailable(sizeMB: number): boolean {
    return this.getTotalUsed() + sizeMB <= this.maxMemoryMB;
  }
}
