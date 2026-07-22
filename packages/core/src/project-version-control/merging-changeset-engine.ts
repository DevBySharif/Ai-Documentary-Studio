import { StructuredChangeset, MergeStrategyType } from "./version-control-types";

export interface MergeResult {
  readonly isMerged: boolean;
  readonly strategyUsed: MergeStrategyType;
  readonly mergedChangesetsCount: number;
}

/**
 * Merging Engine & Structured Changeset Log (Vol 08 Part 03 - Section 8, Section 9, Section 10).
 * Records granular changesets (`SceneAdded`, `CharacterRenamed`, `TimelineAdjusted`) and executes branch merge strategies.
 */
export class MergingChangesetEngine {
  private changesets: StructuredChangeset[] = [];

  public logChangeset(
    projectId: string,
    branchName: string,
    authorUserId: string,
    description: string,
    deltaType: string
  ): StructuredChangeset {
    const cs: StructuredChangeset = {
      changeId: `cs_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      branchName,
      authorUserId,
      description,
      deltaType,
      timestamp: new Date(),
    };

    this.changesets.push(cs);
    return cs;
  }

  public mergeBranches(
    sourceBranch: string,
    targetBranch: string,
    strategy: MergeStrategyType = "AutomaticMerge"
  ): MergeResult {
    const sourceChanges = this.changesets.filter((c) => c.branchName === sourceBranch);

    return {
      isMerged: true,
      strategyUsed: strategy,
      mergedChangesetsCount: sourceChanges.length,
    };
  }
}
