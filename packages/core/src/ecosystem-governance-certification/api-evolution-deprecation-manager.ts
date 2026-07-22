import { ApiLifecycleStage } from "./ecosystem-governance-types";

export interface ApiDeprecationDescriptor {
  readonly apiSymbol: string;
  readonly currentStage: ApiLifecycleStage;
  readonly deprecationNotice: string;
  readonly recommendedReplacement: string;
  readonly plannedRemovalDate: Date;
}

/**
 * 5-Stage API Evolution Manager & Deprecation Engine (Vol 10 Part 08 - Section 4, Section 5).
 * Manages 5 API lifecycle stages (`Experimental → Preview → Stable → Deprecated → Retired`) and issues deprecation notices.
 */
export class ApiEvolutionDeprecationManager {
  private apiStages = new Map<string, ApiLifecycleStage>();

  public updateApiLifecycleStage(apiSymbol: string, stage: ApiLifecycleStage): ApiLifecycleStage {
    this.apiStages.set(apiSymbol, stage);
    return stage;
  }

  public issueDeprecationNotice(
    apiSymbol: string,
    replacement: string,
    plannedRemovalMonths = 12
  ): ApiDeprecationDescriptor {
    this.apiStages.set(apiSymbol, "Deprecated");
    return {
      apiSymbol,
      currentStage: "Deprecated",
      deprecationNotice: `API '${apiSymbol}' is deprecated and will be removed in ${plannedRemovalMonths} months.`,
      recommendedReplacement: replacement,
      plannedRemovalDate: new Date(Date.now() + plannedRemovalMonths * 30 * 24 * 3600 * 1000),
    };
  }
}
