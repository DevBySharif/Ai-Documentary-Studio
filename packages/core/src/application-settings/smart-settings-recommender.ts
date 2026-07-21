import * as os from 'os';

export interface HardwareInfo {
  cpuCores: number;
  cpuSpeed: number;
  cpuModel: string;
  totalRamGB: number;
  freeRamGB: number;
  isGpuAvailable: boolean;
  gpuMemoryMB: number;
  platform: string;
  architecture: string;
}

export interface RenderRecommendation {
  resolution: string;
  fps: number;
  codec: string;
  bitrate: number;
  hardwareAcceleration: boolean;
  multiThreadRendering: boolean;
  renderPriority: string;
}

export interface PerformanceRecommendation {
  cpuUsageLimit: number;
  gpuUsageLimit: number;
  ramLimit: number;
  backgroundRendering: boolean;
  concurrentJobs: number;
}

export interface CacheRecommendation {
  image: { enabled: boolean; maxSize: number };
  voice: { enabled: boolean; maxSize: number };
  prompt: { enabled: boolean; maxSize: number };
  render: { enabled: boolean; maxSize: number };
  thumbnail: { enabled: boolean; maxSize: number };
}

export class ASSmartSettingsRecommender {
  private hardware: HardwareInfo | null = null;

  analyzeHardware(): HardwareInfo {
    const cpus = os.cpus();
    const totalRamBytes = os.totalmem();
    const freeRamBytes = os.freemem();

    this.hardware = {
      cpuCores: cpus.length,
      cpuSpeed: cpus.length > 0 ? cpus[0].speed : 0,
      cpuModel: cpus.length > 0 ? cpus[0].model : 'Unknown',
      totalRamGB: Math.round(totalRamBytes / (1024 * 1024 * 1024)),
      freeRamGB: Math.round(freeRamBytes / (1024 * 1024 * 1024)),
      isGpuAvailable: true,
      gpuMemoryMB: 2048,
      platform: os.platform(),
      architecture: os.arch(),
    };

    return this.clone(this.hardware);
  }

  recommendRenderSettings(): RenderRecommendation {
    if (!this.hardware) this.analyzeHardware();
    const hw = this.hardware!;

    const isHighEnd = hw.cpuCores >= 8 && hw.totalRamGB >= 16 && hw.isGpuAvailable;
    const isMidRange = hw.cpuCores >= 4 && hw.totalRamGB >= 8;

    let resolution: string;
    let fps: number;
    let codec: string;
    let bitrate: number;
    let hardwareAcceleration: boolean;
    let multiThreadRendering: boolean;
    let renderPriority: string;

    if (isHighEnd) {
      resolution = '3840x2160';
      fps = 60;
      codec = 'h265';
      bitrate = 40000;
      hardwareAcceleration = true;
      multiThreadRendering = true;
      renderPriority = 'high';
    } else if (isMidRange) {
      resolution = '1920x1080';
      fps = 30;
      codec = 'h264';
      bitrate = 8000;
      hardwareAcceleration = true;
      multiThreadRendering = true;
      renderPriority = 'normal';
    } else {
      resolution = '1280x720';
      fps = 24;
      codec = 'h264';
      bitrate = 3000;
      hardwareAcceleration = false;
      multiThreadRendering = false;
      renderPriority = 'low';
    }

    return {
      resolution,
      fps,
      codec,
      bitrate,
      hardwareAcceleration,
      multiThreadRendering,
      renderPriority,
    };
  }

  recommendPerformanceSettings(): PerformanceRecommendation {
    if (!this.hardware) this.analyzeHardware();
    const hw = this.hardware!;

    const isHighEnd = hw.cpuCores >= 8 && hw.totalRamGB >= 16;
    const isMidRange = hw.cpuCores >= 4 && hw.totalRamGB >= 8;

    if (isHighEnd) {
      return {
        cpuUsageLimit: 90,
        gpuUsageLimit: 95,
        ramLimit: Math.max(4096, Math.round(hw.totalRamGB * 512)),
        backgroundRendering: true,
        concurrentJobs: Math.min(hw.cpuCores, 8),
      };
    } else if (isMidRange) {
      return {
        cpuUsageLimit: 75,
        gpuUsageLimit: 80,
        ramLimit: Math.max(2048, Math.round(hw.totalRamGB * 384)),
        backgroundRendering: true,
        concurrentJobs: Math.max(1, Math.min(hw.cpuCores - 1, 4)),
      };
    } else {
      return {
        cpuUsageLimit: 50,
        gpuUsageLimit: 50,
        ramLimit: Math.max(1024, Math.round(hw.totalRamGB * 256)),
        backgroundRendering: false,
        concurrentJobs: 1,
      };
    }
  }

  recommendCacheSettings(): CacheRecommendation {
    if (!this.hardware) this.analyzeHardware();
    const hw = this.hardware!;

    const hasSpace = hw.freeRamGB >= 4;
    const baseMultiplier = hasSpace ? 1 : 0.5;

    return {
      image: { enabled: true, maxSize: Math.round(512 * baseMultiplier) },
      voice: { enabled: true, maxSize: Math.round(256 * baseMultiplier) },
      prompt: { enabled: true, maxSize: Math.round(64 * baseMultiplier) },
      render: { enabled: hw.totalRamGB >= 16, maxSize: Math.round(2048 * baseMultiplier) },
      thumbnail: { enabled: true, maxSize: Math.round(128 * baseMultiplier) },
    };
  }

  getAllRecommendations(): {
    hardware: HardwareInfo;
    render: RenderRecommendation;
    performance: PerformanceRecommendation;
    cache: CacheRecommendation;
  } {
    return {
      hardware: this.analyzeHardware(),
      render: this.recommendRenderSettings(),
      performance: this.recommendPerformanceSettings(),
      cache: this.recommendCacheSettings(),
    };
  }

  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
