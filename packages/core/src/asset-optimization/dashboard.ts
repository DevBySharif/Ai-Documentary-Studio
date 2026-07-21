export interface LibraryDashboard {
  libraryHealth: number;
  reuseRate: number;
  archiveSize: number;
  averageQuality: number;
  averageStyleScore: number;
  optimizationQueue: number;
  regenerationQueue: number;
}

export class LibraryDashboardService {
  build(
    health: number,
    reuseRate: number,
    archiveSize: number,
    avgQuality: number,
    avgStyle: number,
    optQueue: number,
    regenQueue: number
  ): LibraryDashboard {
    return {
      libraryHealth: health,
      reuseRate: Math.round(reuseRate * 100) / 100,
      archiveSize,
      averageQuality: Math.round(avgQuality * 100) / 100,
      averageStyleScore: Math.round(avgStyle * 100) / 100,
      optimizationQueue: optQueue,
      regenerationQueue: regenQueue
    };
  }
}
