import type { GRAIOptimizerDecision, GRRenderStats } from "./types.js";

export class GRAIRenderOptimizer {
  analyze(stats: GRRenderStats): GRAIOptimizerDecision {
    const bottleneck = this.predictBottleneck(stats);
    const textureOrder = this.optimizeTextureOrder(stats);
    const cacheAdjustment = this.adjustCacheSize(stats);
    const spikeReduction = this.reduceSpikes(stats);

    return {
      bottleneckPrediction: bottleneck,
      textureOrder,
      cacheSizeAdjustment: cacheAdjustment,
      gpuSpikeReduction: spikeReduction,
      estimatedRemaining: this.estimateRemaining(stats)
    };
  }

  private predictBottleneck(stats: GRRenderStats): string {
    if (stats.avgFrameTimeMs > 50) return "frame_rendering";
    if (stats.vramUsedMB > 6144) return "gpu_memory";
    if (stats.failedFrames > stats.totalFrames * 0.05) return "encoding";
    return "texture_loading";
  }

  private optimizeTextureOrder(_stats: GRRenderStats): string[] {
    return ["scene_0", "scene_1", "scene_2"];
  }

  private adjustCacheSize(stats: GRRenderStats): number {
    if (stats.vramUsedMB > 6144) return -128;
    if (stats.vramUsedMB < 2048) return 128;
    return 0;
  }

  private reduceSpikes(stats: GRRenderStats): number {
    if (stats.vramUsedMB > 7168) return 20;
    return 0;
  }

  private estimateRemaining(stats: GRRenderStats): number {
    if (stats.renderedFrames === 0) return stats.totalFrames * 50;
    const avg = stats.elapsedMs / stats.renderedFrames;
    return avg * (stats.totalFrames - stats.renderedFrames);
  }

  shouldReduceQuality(stats: GRRenderStats): boolean {
    return stats.avgFrameTimeMs > 100 || stats.vramUsedMB > 7168;
  }
}
