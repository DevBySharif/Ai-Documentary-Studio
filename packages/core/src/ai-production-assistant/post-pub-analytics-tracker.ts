import { PostPubAnalytics } from "./assistant-types";

/**
 * Post-Publication Analytics Tracker & Continuous Learning Engine (Vol 04 Part 12 - Section 17, Section 18).
 * Records engagement, retention, CTR metrics, and uses historical outcomes to refine future recommendations.
 */
export class PostPubAnalyticsTracker {
  private analyticsHistory: PostPubAnalytics[] = [];

  public recordAnalytics(data: Omit<PostPubAnalytics, "recordedAt">): PostPubAnalytics {
    const entry: PostPubAnalytics = {
      ...data,
      recordedAt: new Date(),
    };
    this.analyticsHistory.push(entry);
    return entry;
  }

  public getHistoricalCTR(projectId: string): number {
    const records = this.analyticsHistory.filter((a) => a.projectId === projectId);
    if (records.length === 0) return 4.5; // Default baseline CTR %
    const sum = records.reduce((acc, r) => acc + r.clickThroughRatePercent, 0);
    return Math.round((sum / records.length) * 10) / 10;
  }
}
