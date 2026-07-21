import { createStore } from "../../../stores/core/create-store";

export interface Clip {
  id: string;
  assetId: string;
  startTime: number;
  duration: number;
}

export interface TimelineState {
  clips: Clip[];
  playheadPosition: number;
  zoomLevel: number;
  // Undo/Redo tracking
  history: {
    past: Clip[][];
    future: Clip[][];
  };
}

export const timelineStore = createStore<TimelineState>({
  clips: [],
  playheadPosition: 0,
  zoomLevel: 100,
  history: {
    past: [],
    future: [],
  }
});

export const timelineActions = {
  addClip(clip: Clip) {
    timelineStore.setState((draft) => {
      const newClips = [...draft.clips, clip];
      return {
        clips: newClips,
        history: {
          past: [...draft.history.past, draft.clips],
          future: [] // invalidate future on new action
        }
      };
    });
  },
  
  undo() {
    timelineStore.setState((draft) => {
      const past = draft.history.past;
      if (past.length === 0) return draft; // Nothing to undo
      
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      
      return {
        clips: previous,
        history: {
          past: newPast,
          future: [draft.clips, ...draft.history.future]
        }
      };
    });
  },

  redo() {
    timelineStore.setState((draft) => {
      const future = draft.history.future;
      if (future.length === 0) return draft; // Nothing to redo
      
      const next = future[0];
      const newFuture = future.slice(1);
      
      return {
        clips: next,
        history: {
          past: [...draft.history.past, draft.clips],
          future: newFuture
        }
      };
    });
  }
};
