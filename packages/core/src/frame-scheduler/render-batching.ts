import type { FSRenderBatch } from "./types.js";

export class FSRenderBatching {
  private batches: FSRenderBatch[] = [];
  private index = 0;

  createBatches(totalFrames: number, batchSize: number): FSRenderBatch[] {
    this.batches = [];
    for (let start = 1; start <= totalFrames; start += batchSize) {
      const end = Math.min(start + batchSize - 1, totalFrames);
      const frames: number[] = [];
      for (let f = start; f <= end; f++) frames.push(f);
      this.batches.push({ id: `batch_${this.index++}`, startFrame: start, endFrame: end, frames });
    }
    return this.getBatches();
  }

  getBatch(frame: number): FSRenderBatch | undefined {
    return this.batches.find((b) => frame >= b.startFrame && frame <= b.endFrame);
  }

  getBatches(): FSRenderBatch[] {
    return this.batches.map((b) => ({ ...b }));
  }

  getBatchCount(): number {
    return this.batches.length;
  }

  getBatchSize(batch: FSRenderBatch): number {
    return batch.frames.length;
  }

  mergeBatches(batchIds: string[]): FSRenderBatch | null {
    const toMerge = this.batches.filter((b) => batchIds.includes(b.id));
    if (toMerge.length === 0) return null;

    const startFrame = Math.min(...toMerge.map((b) => b.startFrame));
    const endFrame = Math.max(...toMerge.map((b) => b.endFrame));
    const frames: number[] = [];
    for (let f = startFrame; f <= endFrame; f++) frames.push(f);

    const merged: FSRenderBatch = { id: `batch_merged_${this.index++}`, startFrame, endFrame, frames };
    this.batches = this.batches.filter((b) => !batchIds.includes(b.id));
    this.batches.push(merged);
    this.batches.sort((a, b) => a.startFrame - b.startFrame);
    return merged;
  }

  clear(): void {
    this.batches = [];
    this.index = 0;
  }
}
