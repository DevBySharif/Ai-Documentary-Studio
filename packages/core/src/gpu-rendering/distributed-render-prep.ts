import type { GRDistributedChunk } from "./types.js";

export class GRDistributedRenderPreparation {
  private chunks: GRDistributedChunk[] = [];
  private index = 0;

  splitProject(totalFrames: number, chunkSize: number, scenes: string[]): GRDistributedChunk[] {
    this.chunks = [];
    let frameStart = 1;
    for (let i = 0; i < scenes.length; i++) {
      const sceneFrames = chunkSize;
      const frameEnd = Math.min(frameStart + sceneFrames - 1, totalFrames);
      this.chunks.push({
        id: `chunk_${this.index++}`,
        startFrame: frameStart,
        endFrame: frameEnd,
        scene: scenes[i] ?? `scene_${i}`,
        encoded: false,
        outputPath: `chunk_${this.index - 1}.mp4`
      });
      frameStart = frameEnd + 1;
      if (frameStart > totalFrames) break;
    }
    return this.getChunks();
  }

  getChunks(): GRDistributedChunk[] {
    return this.chunks.map((c) => ({ ...c }));
  }

  markEncoded(chunkId: string): void {
    const chunk = this.chunks.find((c) => c.id === chunkId);
    if (chunk) chunk.encoded = true;
  }

  allEncoded(): boolean {
    return this.chunks.length > 0 && this.chunks.every((c) => c.encoded);
  }

  getPendingChunks(): GRDistributedChunk[] {
    return this.chunks.filter((c) => !c.encoded);
  }

  clear(): void {
    this.chunks = [];
    this.index = 0;
  }
}
