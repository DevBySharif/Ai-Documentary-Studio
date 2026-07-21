import { ProjectManagerStore } from "./project-manager-store";
import { AiActivityFeedMonitor } from "./ai-activity-feed-monitor";
import { GlobalSearchEngine } from "./global-search-engine";
import { NotificationCenterManager } from "./notification-center-manager";
import { ResourceMonitorWidget } from "./resource-monitor-widget";
import { ProductionStatistics } from "./dashboard-types";

export interface RecentExportItem {
  readonly exportId: string;
  readonly title: string;
  readonly format: string;
  readonly resolution: string;
  readonly exportedAt: Date;
  readonly destinationPath: string;
}

/**
 * Master Dashboard Engine (Main Vol 05 Part 02).
 * Orchestrates mission control layout, welcome area, quick actions, recent projects, pinned projects,
 * AI activity feed, production statistics, recent exports, and system resource monitoring.
 */
export class MasterDashboardEngine {
  public readonly projectStore = new ProjectManagerStore();
  public readonly activityMonitor = new AiActivityFeedMonitor();
  public readonly globalSearch = new GlobalSearchEngine();
  public readonly notificationCenter = new NotificationCenterManager();
  public readonly resourceMonitor = new ResourceMonitorWidget();

  public getProductionStatistics(): ProductionStatistics {
    return {
      activeProjectsCount: 3,
      completedDocumentariesCount: 12,
      totalRenderTimeHours: 24.5,
      totalAiGenerationsCount: 1420,
      totalScriptWordCount: 48500,
    };
  }

  public getRecentExports(): ReadonlyArray<RecentExportItem> {
    return [
      {
        exportId: "exp_101",
        title: "The Industrial Revolution - Final Master",
        format: "ProRes 422 HQ",
        resolution: "3840x2160 (4K)",
        exportedAt: new Date("2026-07-21T16:00:00Z"),
        destinationPath: "d:/Youtube/Ai Documentary Studio/exports/ind_rev_4k.mov",
      },
    ];
  }
}
