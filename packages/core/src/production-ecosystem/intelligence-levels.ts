export type IntelligenceLevel =
  | "Level1_Assisted" // AI assists only when requested
  | "Level2_ContinuousRecommendation" // AI continuously recommends improvements
  | "Level3_MilestonePlanning" // Full production planning with milestone approvals
  | "Level4_AutonomousProduction"; // Autonomous mode from topic -> production pipeline

export interface IntelligenceConfig {
  readonly currentLevel: IntelligenceLevel;
  readonly autoSuggestTransitions: boolean;
  readonly autoCheckContinuity: boolean;
  readonly requireMilestoneApproval: boolean;
}

/**
 * Intelligence Levels & Mode Manager (Vol 04 Part 01 - Section 6).
 */
export class IntelligenceModeManager {
  private config: IntelligenceConfig = {
    currentLevel: "Level2_ContinuousRecommendation",
    autoSuggestTransitions: true,
    autoCheckContinuity: true,
    requireMilestoneApproval: true,
  };

  public setLevel(level: IntelligenceLevel): void {
    this.config = {
      ...this.config,
      currentLevel: level,
      requireMilestoneApproval: level === "Level3_MilestonePlanning" || level === "Level4_AutonomousProduction",
    };
  }

  public getConfig(): Readonly<IntelligenceConfig> {
    return this.config;
  }
}
