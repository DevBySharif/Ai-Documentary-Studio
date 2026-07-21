import type { GRBufferType } from "./types.js";

export class GRFrameBufferManager {
  private buffers: Map<GRBufferType, number> = new Map();

  constructor() {
    this.buffers.set("current_frame", 0);
    this.buffers.set("previous_frame", 0);
    this.buffers.set("next_frame", 0);
    this.buffers.set("intermediate", 0);
    this.buffers.set("render_target", 0);
  }

  allocate(type: GRBufferType, sizeMB: number): boolean {
    this.buffers.set(type, sizeMB);
    return true;
  }

  free(type: GRBufferType): void {
    this.buffers.set(type, 0);
  }

  getSize(type: GRBufferType): number {
    return this.buffers.get(type) ?? 0;
  }

  getTotalAllocated(): number {
    let total = 0;
    for (const [, size] of this.buffers) total += size;
    return total;
  }

  swapBuffers(): void {
    const prev = this.buffers.get("current_frame") ?? 0;
    const next = this.buffers.get("next_frame") ?? 0;
    this.buffers.set("previous_frame", prev);
    this.buffers.set("current_frame", next);
  }

  clear(): void {
    for (const key of this.buffers.keys()) this.buffers.set(key, 0);
  }
}
