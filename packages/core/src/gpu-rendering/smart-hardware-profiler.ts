import type { GRHardwareBenchmark, GRHardwareProfile, GRHardwareEncoder, GRGPUVendor } from "./types.js";

export class GRSmartHardwareProfiler {
  private profile: GRHardwareBenchmark | null = null;
  private benchmarks: GRHardwareBenchmark[] = [];

  build(gpuModel: string, driverVersion: string, vendor: GRGPUVendor, encoder: GRHardwareEncoder): GRHardwareBenchmark {
    const benchmark: GRHardwareBenchmark = {
      gpuModel,
      driverVersion,
      vramBandwidth: 0,
      encoderSpeed: 0,
      previousRenderTime: 0,
      thermalThrottling: false
    };

    this.profile = benchmark;
    this.benchmarks.push(benchmark);
    return benchmark;
  }

  updateRenderTime(timeMs: number): void {
    if (this.profile) this.profile.previousRenderTime = timeMs;
  }

  updateThermal(throttling: boolean): void {
    if (this.profile) this.profile.thermalThrottling = throttling;
  }

  getProfile(): GRHardwareBenchmark | null {
    return this.profile ? { ...this.profile } : null;
  }

  getBestStrategy(): string {
    if (!this.profile) return "default";

    if (this.profile.thermalThrottling) return "power_saving";
    if (this.profile.previousRenderTime > 3600000) return "performance";
    return "balanced";
  }

  estimateRenderTime(totalFrames: number): number {
    if (!this.profile || this.profile.encoderSpeed === 0) return totalFrames * 40;
    return (totalFrames / this.profile.encoderSpeed) * 1000;
  }

  getBenchmarkHistory(): GRHardwareBenchmark[] {
    return this.benchmarks.map((b) => ({ ...b }));
  }

  clear(): void {
    this.profile = null;
    this.benchmarks = [];
  }
}
