import type { WMHealthReport } from "./types.js";

export class WMWorkspaceHealthAnalyzer {
  analyze(corrupted: number, missing: number, brokenLinks: number, diskSpace: number, cacheGrowth: number, archiveOK: boolean): WMHealthReport {
    return {
      corruptedProjects: corrupted, missingAssets: missing, brokenLinks,
      diskSpace, cacheGrowth, archiveIntegrity: archiveOK,
      healthy: corrupted === 0 && missing === 0 && brokenLinks === 0 && archiveOK
    };
  }

  recommend(report: WMHealthReport): string[] {
    const recs: string[] = [];
    if (report.corruptedProjects > 0) recs.push(`Restore ${report.corruptedProjects} corrupted project(s) from backup`);
    if (report.missingAssets > 0) recs.push(`Re-link ${report.missingAssets} missing asset(s)`);
    if (report.brokenLinks > 0) recs.push(`Fix ${report.brokenLinks} broken link(s)`);
    if (report.diskSpace < 10) recs.push("Free up disk space");
    if (report.cacheGrowth > 1024) recs.push("Clear cache to free space");
    if (!report.archiveIntegrity) recs.push("Verify archive integrity");
    return recs;
  }
}
