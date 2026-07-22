import { ActivityMetricsAggregationDb } from "./activity-metrics-aggregation-db";
import { TeamProductivityBottleneckDetector } from "./team-productivity-bottleneck-detector";
import { AiOperationsCostAnalytics } from "./ai-operations-cost-analytics";
import { ReportingEngineKpiAlerts } from "./reporting-engine-kpi-alerts";
import { DashboardCategoryType, ProjectDashboardMetrics } from "./analytics-types";

/**
 * Master Enterprise Analytics Monitoring Engine (Main Vol 08 Part 06).
 * Core entry point for 6-layer analytics pipeline (`Activity Events → Metrics Engine → Aggregation Layer → Analytics DB → Dashboards → Reports`).
 */
export class MasterEnterpriseAnalyticsMonitoring {
  public readonly activityDb = new ActivityMetricsAggregationDb();
  public readonly productivityDetector = new TeamProductivityBottleneckDetector();
  public readonly aiCostAnalytics = new AiOperationsCostAnalytics();
  public readonly reportingKpiEngine = new ReportingEngineKpiAlerts();

  public getDashboardMetrics(category: DashboardCategoryType, projectId = "proj_default"): ProjectDashboardMetrics {
    return {
      projectId,
      completionPercentage: 78,
      activeTasksCount: 4,
      pendingApprovalsCount: 2,
      tokensConsumed: 125000,
      currentSpendUSD: 2.15,
      openReviewItemsCount: 1,
    };
  }
}
