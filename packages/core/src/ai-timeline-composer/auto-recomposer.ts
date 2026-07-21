import { ComposedTimeline, ComposedClip } from "./composer-types";

/**
 * Incremental Auto-Recomposer (Vol 04 Part 09 - Section 16, Section 17).
 * Recomposes only affected narration regions during script changes, preserving user-locked clips and manual edits.
 */
export class AutoRecomposer {
  public recomposeAffectedRegion(
    currentTimeline: ComposedTimeline,
    affectedStartFrame: number,
    affectedEndFrame: number,
    newClips: ReadonlyArray<ComposedClip>
  ): ComposedTimeline {
    const preservedClips = currentTimeline.clips.filter(
      (c) => c.isUserLocked || c.startFrame < affectedStartFrame || c.startFrame > affectedEndFrame
    );

    const mergedClips = [...preservedClips, ...newClips].sort((a, b) => a.startFrame - b.startFrame);

    return {
      ...currentTimeline,
      clips: mergedClips,
    };
  }
}
