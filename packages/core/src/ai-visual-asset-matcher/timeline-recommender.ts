import { VisualMatchRecommendation } from "./matcher-types";

export interface TimelineClipSuggestion {
  readonly clipId: string;
  readonly assetId: string;
  readonly assetTitle: string;
  readonly startTimeSecs: number;
  readonly durationSecs: number;
  readonly motionType: string;
  readonly transitionType: string;
  readonly trackPriority: number;
  readonly isLocked: boolean;
}

/**
 * Timeline Recommender & User Lock Manager (Vol 04 Part 05 - Section 17, Section 18).
 * Transforms visual match recommendations into timeline clip placement suggestions.
 */
export class TimelineRecommender {
  private userLocks = new Map<string, boolean>();

  public setUserLock(clipId: string, isLocked: boolean): void {
    this.userLocks.set(clipId, isLocked);
  }

  public generateTimelineSuggestions(matches: ReadonlyArray<VisualMatchRecommendation>): ReadonlyArray<TimelineClipSuggestion> {
    let currentTime = 0;

    return matches.map((m, idx) => {
      const clipId = `clip_sug_${idx}_${m.matchId}`;
      const isLocked = this.userLocks.get(clipId) || m.isLockedByUser;

      const suggestion: TimelineClipSuggestion = {
        clipId,
        assetId: m.recommendedAsset.assetId,
        assetTitle: m.recommendedAsset.title,
        startTimeSecs: currentTime,
        durationSecs: m.recommendedDurationSecs,
        motionType: "KenBurns",
        transitionType: "CrossDissolve",
        trackPriority: 1, // Main V1 B-roll track
        isLocked,
      };

      currentTime += m.recommendedDurationSecs;
      return suggestion;
    });
  }
}
