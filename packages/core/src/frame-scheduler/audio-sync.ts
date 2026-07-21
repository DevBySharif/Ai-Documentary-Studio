import type { FSAudioState } from "./types.js";

export class FSAudioSynchronizer {
  sync(audioPosition: number, masterTime: number, tolerance: number): { drift: number; corrected: boolean } {
    const drift = audioPosition - masterTime;
    return { drift, corrected: Math.abs(drift) <= tolerance };
  }

  alignWordHighlight(wordStartMs: number, wordEndMs: number, frameTimestamp: number, fps: number): { highlightFrame: number; hideFrame: number } {
    const highlightFrame = Math.round((wordStartMs / 1000) * fps);
    const hideFrame = Math.round((wordEndMs / 1000) * fps);
    return { highlightFrame, hideFrame };
  }

  getAudioState(position: number, isSpeaking: boolean, duckAttenuation: number): FSAudioState {
    return { position, speaking: isSpeaking, ducking: duckAttenuation };
  }

  detectDrift(audioPosition: number, masterPosition: number, thresholdMs: number): boolean {
    return Math.abs(audioPosition - masterPosition) > thresholdMs;
  }
}
