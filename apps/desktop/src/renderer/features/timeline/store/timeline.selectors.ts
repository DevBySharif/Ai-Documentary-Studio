import { TimelineState } from "./timeline.store";

export const timelineSelectors = {
  /**
   * Derived state: Total duration of the timeline based on the last clip's end time.
   */
  selectTotalDuration(state: TimelineState): number {
    if (state.clips.length === 0) return 0;
    
    return state.clips.reduce((maxEndTime, clip) => {
      const endTime = clip.startTime + clip.duration;
      return endTime > maxEndTime ? endTime : maxEndTime;
    }, 0);
  },

  /**
   * Derived state: Can we currently undo?
   */
  selectCanUndo(state: TimelineState): boolean {
    return state.history.past.length > 0;
  },

  /**
   * Derived state: Can we currently redo?
   */
  selectCanRedo(state: TimelineState): boolean {
    return state.history.future.length > 0;
  }
};
