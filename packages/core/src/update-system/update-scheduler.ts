import { UpdatePackage } from './types';
import { UpdateManager } from './update-manager';

export type ScheduleCondition = "Immediate" | "OnRestart" | "MaintenanceWindow" | "Manual";

export class UpdateScheduler {
  private scheduledUpdates: Map<string, { pkg: UpdatePackage, condition: ScheduleCondition, time?: Date }> = new Map();

  constructor(private updateManager: UpdateManager) {}

  scheduleUpdate(pkg: UpdatePackage, condition: ScheduleCondition, time?: Date): void {
    this.scheduledUpdates.set(pkg.id, { pkg, condition, time });
    
    if (condition === "Immediate") {
      this.updateManager.checkAndApplyUpdate(pkg);
    }
    
    // In a real system, background downloads might start here for other conditions
  }

  getScheduledUpdates(): UpdatePackage[] {
    return Array.from(this.scheduledUpdates.values()).map(s => s.pkg);
  }

  onRestartHook(): void {
    // Execute all OnRestart updates
    for (const [id, schedule] of this.scheduledUpdates.entries()) {
      if (schedule.condition === "OnRestart") {
        this.updateManager.checkAndApplyUpdate(schedule.pkg);
        this.scheduledUpdates.delete(id);
      }
    }
  }
}
