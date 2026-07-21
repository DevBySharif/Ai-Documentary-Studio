import type { FSSubtitleState } from "./types.js";

export class FSSubtitleSynchronizer {
  scheduleSentence(startMs: number, endMs: number, fps: number, text: string): { showFrame: number; hideFrame: number } {
    return {
      showFrame: Math.round((startMs / 1000) * fps),
      hideFrame: Math.round((endMs / 1000) * fps)
    };
  }

  schedulePhrase(startMs: number, endMs: number, fps: number): { showFrame: number; hideFrame: number } {
    return this.scheduleSentence(startMs, endMs, fps, "");
  }

  scheduleWord(wordStartMs: number, wordEndMs: number, fps: number): { highlightFrame: number; hideFrame: number } {
    return {
      highlightFrame: Math.round((wordStartMs / 1000) * fps),
      hideFrame: Math.round((wordEndMs / 1000) * fps)
    };
  }

  scheduleKeyword(keywordStartMs: number, keywordEndMs: number, fps: number, animation: string): { frame: number; animation: string } {
    return {
      frame: Math.round((keywordStartMs / 1000) * fps),
      animation
    };
  }

  getState(active: boolean, text: string, highlighted: string | null, animation: string, opacity: number): FSSubtitleState {
    return { active, text, highlightedWord: highlighted, animation, opacity };
  }
}
