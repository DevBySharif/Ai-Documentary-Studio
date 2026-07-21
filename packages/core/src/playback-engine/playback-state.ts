/**
 * All valid playback state transitions for the Playback Engine.
 */
export type PlaybackEngineState =
  | "Stopped"
  | "Playing"
  | "Paused"
  | "Seeking"
  | "Scrubbing"
  | "Buffering"
  | "Recovering";

export interface PlaybackStateChangeEvent {
  readonly previousState: PlaybackEngineState;
  readonly currentState: PlaybackEngineState;
  readonly frame: number;
  readonly timestamp: Date;
}
