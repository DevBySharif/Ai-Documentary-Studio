export class PredictiveAnalyticsEngine {
  predictRenderCompletion(framesRemaining: number, currentFps: number): number {
    if (currentFps <= 0) return -1;
    return (framesRemaining / currentFps) * 1000; // time in ms
  }

  predictStorageExhaustionDays(currentUsageGB: number, maxCapacityGB: number, dailyGrowthGB: number): number {
    if (dailyGrowthGB <= 0) return -1;
    const remainingGB = maxCapacityGB - currentUsageGB;
    return remainingGB / dailyGrowthGB;
  }

  predictMonthlyCosts(currentCosts: number, daysElapsed: number, totalDaysInMonth: number): number {
    if (daysElapsed <= 0) return 0;
    const dailyBurnRate = currentCosts / daysElapsed;
    return dailyBurnRate * totalDaysInMonth;
  }
}
